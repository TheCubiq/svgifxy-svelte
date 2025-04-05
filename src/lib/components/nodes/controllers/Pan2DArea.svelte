<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { getMousePos, roundTo, type GestureEvent } from '$lib/utils/commonUtils';

	// Props with defaults
	export let x = 0.5; // normalized (0-1)
	export let y = 0.5; // normalized (0-1)
	export let handleSize = 20;
	export let mode = 'absolute'; // 'absolute' or 'relative'
	export let disabled = false;
	export let smoothScroll = true; // Enable/disable smooth scrolling with momentum
	export let friction = 0.9; // Friction for smooth scrolling
	export let cursor = 'auto'; // CSS cursor style
	export let infiniteMouse = false; // Enable infinite mouse scrolling
	export let scrollToModify = { x: 0, y: 0 }; // Control scroll modification per axis

	// Sensitivity settings
	export let sensitivitySettings = {
		default: 1, // Default sensitivity multiplier
		speed: [0.05, 5] // Min and max sensitivity range
	};

	// Clamping configuration
	export let clamping = {
		minX: true,
		maxX: true,
		minY: true,
		maxY: true
	};

	// Default position values for reset
	export let defaultX = 0.5;
	export let defaultY = 0.5;

	// Internal state
	let container: HTMLDivElement;
	let active = false;
	let sensitivity = sensitivitySettings.default;
	let showSensitivity = false;
	let sensitivityTimeout: ReturnType<typeof setTimeout> | null = null;
	let isPointerLocked = false;
	let pointerLockSupported = false;

	// Variables for relative mode
	let startX = 0;
	let startY = 0;
	let startDragX = 0;
	let startDragY = 0;

	// Variables for smooth scrolling
	const position = writable({ x, y });
	let velocity = { x: 0, y: 0 };
	let lastPos = { x: 0, y: 0 };
	let animationFrame: number | null = null;

	// For emitting events
	const dispatch = createEventDispatcher();

	// Reset sensitivity when component initializes
	onMount(() => {
		sensitivity = sensitivitySettings.default;
		
		 // Check if Pointer Lock API is supported
		pointerLockSupported = 'pointerLockElement' in document
		
		// Set up pointer lock change event listeners
		if (pointerLockSupported) {
			document.addEventListener('pointerlockchange', handlePointerLockChange);
		}
	});

	// Handle pointer lock state changes
	function handlePointerLockChange() {
		const pointerLockElement = document.pointerLockElement;
		isPointerLocked = pointerLockElement === container;
	}
	
	// Request pointer lock on the container element
	function requestPointerLock() {
		if (!pointerLockSupported || !container) return;
		
		try {
			if (container.requestPointerLock) {
				container.requestPointerLock();
			}
		} catch (e) {
			console.error('Failed to request pointer lock:', e);
		}
	}
	
	// Exit pointer lock
	function exitPointerLock() {
		if (!isPointerLocked) return;
		
		try {
			if (document.exitPointerLock) {
				document.exitPointerLock();
			}
		} catch (e) {
			console.error('Failed to exit pointer lock:', e);
		}
	}

	// Sync the writable store with props
	$: {
		position.set({ x, y });
	}

	// Subscribe to position changes
	position.subscribe((pos) => {
		x = roundTo(pos.x, 3);
		y = roundTo(pos.y, 3);
		dispatch('change', { x, y });
	});

	// Handle scroll wheel to adjust sensitivity or modify values
	function handleWheel(e: WheelEvent) {
		if (disabled) return;
		
		e.preventDefault();
		e.stopPropagation();

		if (active) {
			// When dragging, adjust sensitivity as before
			const delta = e.deltaY > 0 ? -0.1 : 0.1;
			adjustSensitivity(delta);
		} else if (scrollToModify.x !== 0 || scrollToModify.y !== 0) {
			// When not dragging and any scroll axis is enabled
			const delta = e.deltaY > 0 ? -0.02 : 0.02;
			
			// Calculate new position using multipliers
			let newPos = {
				x: x + delta * scrollToModify.x,
				y: y + delta * scrollToModify.y
			};

			if (smoothScroll) {
				velocity = {
					x: delta * scrollToModify.x,
					y: delta * scrollToModify.y
				};
				applyMomentum();
			}

			updatePosition(newPos);
		}
	}

	// Adjust sensitivity and keep within bounds
	function adjustSensitivity(delta: number) {
		const [minSensitivity, maxSensitivity] = sensitivitySettings.speed;

		sensitivity = Math.max(minSensitivity, Math.min(maxSensitivity, sensitivity + delta));

		// Show sensitivity indicator
		showSensitivity = true;

		// Clear any existing timeout
		if (sensitivityTimeout) {
			clearTimeout(sensitivityTimeout);
		}

		// Hide sensitivity indicator after 1.5 seconds
		sensitivityTimeout = setTimeout(() => {
			showSensitivity = false;
		}, 1500);

		dispatch('sensitivity', { sensitivity });
	}

	// Event handler functions
	function handleMouseMove(e: GestureEvent) {
		if (active && !disabled) {
			let pos;
			
			if (infiniteMouse && isPointerLocked && 'movementX' in e && 'movementY' in e) {
				// When pointer is locked, use movementX/Y for infinite mouse
				const rect = container.getBoundingClientRect();
				const moveX = (e as MouseEvent).movementX / rect.width;
				const moveY = (e as MouseEvent).movementY / rect.height;
				
				if (mode === 'relative') {
					// Add movement to start positions directly
					let newX = x + moveX * sensitivity;
					let newY = y + moveY * sensitivity;
					
					// Calculate velocity for smooth scrolling
					if (smoothScroll) {
						velocity = {
							x: moveX * sensitivity,
							y: moveY * sensitivity
						};
						
						// Filter out very small movements
						velocity = {
							x: Math.abs(velocity.x) < 0.005 ? 0 : velocity.x,
							y: Math.abs(velocity.y) < 0.005 ? 0 : velocity.y
						};
					}
					
					updatePosition({ x: newX, y: newY });
					return;
				}
				
				// For absolute mode, just use regular method
				pos = getPos(e);
			} else {
				// Normal mouse handling
				if (mode === 'absolute') {
					pos = getPos(e);
					updatePosition(pos);
				} else { // relative mode
					pos = getPos(e);
					const deltaX = (pos.x - startDragX) * sensitivity;
					const deltaY = (pos.y - startDragY) * sensitivity;
					
					// Calculate new position based on starting position and drag delta
					let newX = startX + deltaX;
					let newY = startY + deltaY;
					
					// Calculate velocity for smooth scrolling
					if (smoothScroll) {
						velocity = {
							x: (pos.x - lastPos.x) * sensitivity,
							y: (pos.y - lastPos.y) * sensitivity
						};
						
						// Filter out very small movements
						velocity = {
							x: Math.abs(velocity.x) < 0.005 ? 0 : velocity.x,
							y: Math.abs(velocity.y) < 0.005 ? 0 : velocity.y
						};
						
						lastPos = pos;
					}
					
					updatePosition({ x: newX, y: newY });
				}
			}
		}
	}

	function handleMouseUp() {
		if (active) {
			active = false;
			
			// Release pointer lock when mouse is released
			if (infiniteMouse && isPointerLocked) {
				exitPointerLock();
			}
			
			if (smoothScroll) {
				// Cancel any existing animation before starting a new one
				if (animationFrame) {
					cancelAnimationFrame(animationFrame);
				}
				applyMomentum();
			}

			dispatch('release', { x, y });
		}
	}

	// Apply clamping based on configuration
	function clampPosition(pos: { x: number; y: number }) {
		let { x: posX, y: posY } = pos;

		// Apply clamping selectively based on configuration
		if (clamping.minX) posX = Math.max(posX, 0);
		if (clamping.maxX) posX = Math.min(posX, 1);
		if (clamping.minY) posY = Math.max(posY, 0);
		if (clamping.maxY) posY = Math.min(posY, 1);

		return { x: posX, y: posY };
	}

	function updatePosition(pos: { x: number; y: number }) {
		// Apply configured clamping
		const clampedPos = clampPosition(pos);
		// Round values to 3 decimal places
		clampedPos.x = roundTo(clampedPos.x, 3);
		clampedPos.y = roundTo(clampedPos.y, 3);
		position.set(clampedPos);
	}

	// Apply momentum for smooth scrolling effect
	function applyMomentum() {
		function animate() {
			if (Math.abs(velocity.x) > 0.001 || Math.abs(velocity.y) > 0.001) {
				velocity = {
					x: velocity.x * friction,
					y: velocity.y * friction
				};

				position.update((pos) => {
					let newX = pos.x + velocity.x;
					let newY = pos.y + velocity.y;

					// Apply selective clamping
					if (clamping.minX && newX < 0) {
						velocity.x = 0;
						newX = 0;
					}
					if (clamping.maxX && newX > 1) {
						velocity.x = 0;
						newX = 1;
					}
					if (clamping.minY && newY < 0) {
						velocity.y = 0;
						newY = 0;
					}
					if (clamping.maxY && newY > 1) {
						velocity.y = 0;
						newY = 1;
					}

					return {
						x: roundTo(newX, 3),
						y: roundTo(newY, 3)
					};
				});

				animationFrame = requestAnimationFrame(animate);
			}
		}

		animationFrame = requestAnimationFrame(animate);
	}

	// Get normalized position from event using the utility function
	function getPos(e: GestureEvent) {
		if (!container) return { x, y }; // Guard against component being destroyed

		const rect = container.getBoundingClientRect();
		const mousePos = getMousePos(e);

		// Calculate normalized positions (0-1)
		let _x = (mousePos.x - rect.left) / rect.width;
		let _y = (mousePos.y - rect.top) / rect.height;

		// We don't clamp here anymore because we handle it in updatePosition
		return { x: _x, y: _y };
	}

	// Mouse/touch handlers
	function handleMouseDown(e: GestureEvent) {
		if (disabled) return;
		
		active = true;
		
		// Cancel any ongoing animation
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
			animationFrame = null;
		}
		
		const pos = getPos(e);
		lastPos = pos;
		velocity = { x: 0, y: 0 };
		
		if (infiniteMouse && mode === 'relative' && pointerLockSupported) {
			// Request pointer lock for infinite mouse mode
			requestPointerLock();
		}
		
		if (mode === 'absolute') {
			updatePosition(pos);
		} else { // relative mode
			// Save the initial position and drag start location
			startX = x;
			startY = y;
			startDragX = pos.x;
			startDragY = pos.y;
		}
		
		e.preventDefault();
		e.stopPropagation(); // Stop event from bubbling up
	}

	// Reset position on double-click
	function handleDoubleClick() {
		if (disabled) return;

		// Cancel any ongoing animation
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
			animationFrame = null;
		}

		// Reset velocity
		velocity = { x: 0, y: 0 };

		// Reset sensitivity to default value
		sensitivity = sensitivitySettings.default;

		// Reset to default position values
		updatePosition({ x: defaultX, y: defaultY });
		dispatch('reset', { x: defaultX, y: defaultY, sensitivity });
	}

	// Clean up animation and timeouts on component destruction
	onDestroy(() => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
		if (sensitivityTimeout) {
			clearTimeout(sensitivityTimeout);
		}
		
		// Clean up pointer lock event listeners
		if (pointerLockSupported) {
			// document.removeEventListener('pointerlockchange', handlePointerLockChange);
			// document.removeEventListener('mozpointerlockchange', handlePointerLockChange);
			// document.removeEventListener('webkitpointerlockchange', handlePointerLockChange);
			
			// Make sure to exit pointer lock when component is destroyed
			if (isPointerLocked) {
				exitPointerLock();
			}
		}
	});

	// Computed values for positioning the handle
	$: handleLeft = `${x * 100}%`;
	$: handleTop = `${y * 100}%`;

	// Calculate adjusted handle size for CSS
	$: halfHandleSize = handleSize / 2;

	// Format sensitivity for display
	$: sensitivityDisplay = Math.round(sensitivity * 100) / 100;

	// Determine cursor style dynamically
	$: effectiveCursor = infiniteMouse && active ? 'none' : cursor;
</script>

<svelte:window
	on:mousemove={handleMouseMove}
	on:mouseup={handleMouseUp}
	on:touchmove={handleMouseMove}
	on:touchend={handleMouseUp}
/>

<div
	bind:this={container}
	class="position-container"
	class:disabled
	class:infinite-mouse={infiniteMouse && active}
	role="button"
	tabindex="0"
	style:cursor={effectiveCursor}
	on:mousedown={handleMouseDown}
	on:touchstart={handleMouseDown}
	on:dblclick={handleDoubleClick}
	on:wheel={handleWheel}
>
	{#if showSensitivity}
		<div class="sensitivity-indicator">
			Sensitivity: {sensitivityDisplay}x
		</div>
	{/if}

	<slot pos={{ x, y }} />
</div>

<style>
	.position-container {
		position: relative;
		/* overflow: hidden; */
		user-select: none;
		touch-action: none;
		box-sizing: border-box;
		border-radius: 4px;
		width: 100%;
		height: 100%;
	}

	.disabled {
		opacity: 0.6;
		pointer-events: none;
	}
	
	.infinite-mouse {
		/* Using this class to apply styles when infinite mouse is active */
		cursor: none;
	}

	.sensitivity-indicator {
		position: absolute;
		top: 8px;
		right: 8px;
		background-color: rgba(0, 0, 0, 0.6);
		color: white;
		border-radius: 4px;
		padding: 4px 8px;
		font-size: 12px;
		pointer-events: none;
		z-index: 10;
		transition: opacity 0.3s ease;
	}
</style>
