document.addEventListener('DOMContentLoaded', () => {
    const syringe = document.getElementById('syringe');
    const denture = document.getElementById('denture');
    const sadMouse = document.getElementById('sad-mouse');
    const happyMouse = document.getElementById('happy-mouse');
    const mouseContainer = document.getElementById('mouse-container');
    const incorrectSound = document.getElementById('incorrect-sound');

    // Create audio context for sound effects
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Check if images are loaded correctly
    // checkImagesLoaded();

    let isDragging = false;
    let offsetX, offsetY;
    let isClicked = false;
    let isDraggingDenture = false;
    let dentureOffsetX, dentureOffsetY;
    let isClickedDenture=false;

    // Make the syringe draggable
    syringe.addEventListener('mousedown', startDrag);
    syringe.addEventListener('touchstart', handleTouch);

    // Make the denture draggable
    denture.addEventListener('mousedown', startDragDenture);
    denture.addEventListener('touchstart', handleTouchDenture);

    function checkImagesLoaded() {
        console.log("Checking images loaded status:");
        
        // Check sad mouse image
        if (sadMouse.complete && sadMouse.naturalHeight !== 0) {
            console.log("Sad mouse image loaded successfully");
        } else {
            console.error("Sad mouse image failed to load");
            // Use a data URI as fallback for sad mouse image (gray circle with sad face)
            sadMouse.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><circle cx='100' cy='100' r='90' fill='%23CCCCCC'/><circle cx='70' cy='80' r='10' fill='%23000'/><circle cx='130' cy='80' r='10' fill='%23000'/><path d='M60 140 Q 100 120 140 140' stroke='%23000' stroke-width='5' fill='none'/></svg>";
        }
        
        // Check happy mouse image
        if (happyMouse.complete && happyMouse.naturalHeight !== 0) {
            console.log("Happy mouse image loaded successfully");
        } else {
            console.error("Happy mouse image failed to load");
            // Use a data URI as fallback for happy mouse image (gray circle with happy face)
            happyMouse.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><circle cx='100' cy='100' r='90' fill='%23CCCCCC'/><circle cx='70' cy='80' r='10' fill='%23000'/><circle cx='130' cy='80' r='10' fill='%23000'/><path d='M60 120 Q 100 160 140 120' stroke='%23000' stroke-width='5' fill='none'/></svg>";
        }
        
        // Check syringe image
        if (syringe.complete && syringe.naturalHeight !== 0) {
            console.log("Syringe image loaded successfully");
        } else {
            console.error("Syringe image failed to load");
            // Use a data URI as fallback for syringe image (simple syringe shape)
            syringe.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='30' viewBox='0 0 100 30'><rect x='10' y='10' width='80' height='10' fill='%23FFFFFF' stroke='%23000' stroke-width='2'/><rect x='10' y='5' width='80' height='20' fill='none' stroke='%23000' stroke-width='2'/><polygon points='90,15 100,5 100,25' fill='%23FFFFFF' stroke='%23000' stroke-width='2'/><rect x='20' y='12' width='60' height='6' fill='%23AADDFF'/></svg>";
        }
        
        // Make mouse container visible
        mouseContainer.style.opacity = '1';
    }

    function startDrag(e) {
        isDragging = true;
        isClicked = true;
        offsetX = e.clientX - syringe.getBoundingClientRect().left;
        offsetY = e.clientY - syringe.getBoundingClientRect().top;
        
        // Ensure syringe is on top during dragging
        syringe.style.zIndex = '100';
        
        // Add event listeners for mouse movement and release
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        
        // Prevent default behavior to avoid text selection during drag
        e.preventDefault();
    }
    
    function handleTouch(e) {
        isDragging = true;
        isClicked = true;
        const touch = e.touches[0];
        offsetX = touch.clientX - syringe.getBoundingClientRect().left;
        offsetY = touch.clientY - syringe.getBoundingClientRect().top;
        
        // Ensure syringe is on top during dragging
        syringe.style.zIndex = '100';
        
        // Add event listeners for touch movement and end
        document.addEventListener('touchmove', dragTouch);
        document.addEventListener('touchend', endDragTouch);
        
        // Prevent default behavior to avoid scrolling during drag
        e.preventDefault();
    }
    
    function drag(e) {
        if (isDragging) {
            syringe.style.position = 'absolute';
            syringe.style.left = `${e.clientX - offsetX}px`;
            syringe.style.top = `${e.clientY - offsetY}px`;
            
            checkCollision();
        }
    }
    
    function dragTouch(e) {
        if (isDragging) {
            const touch = e.touches[0];
            syringe.style.position = 'absolute';
            syringe.style.left = `${touch.clientX - offsetX}px`;
            syringe.style.top = `${touch.clientY - offsetY}px`;
            
            checkCollision();
            e.preventDefault();
        }
    }
    
    function endDrag() {
        isDragging = false;
        // Return to normal z-index when not dragging
        syringe.style.zIndex = '30';
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', endDrag);
    }
    
    function endDragTouch() {
        isDragging = false;
        // Return to normal z-index when not dragging
        syringe.style.zIndex = '30';
        document.removeEventListener('touchmove', dragTouch);
        document.removeEventListener('touchend', endDragTouch);
    }
    
    function checkCollision() {
        // Get bounding rectangles
        const syringeRect = syringe.getBoundingClientRect();
        const mouseRect = sadMouse.getBoundingClientRect();
        
        // Calculate centers
        const syringeCenter = {
            x: syringeRect.left + syringeRect.width / 2,
            y: syringeRect.top + syringeRect.height / 2
        };
        
        const mouseCenter = {
            x: mouseRect.left + mouseRect.width / 2,
            y: mouseRect.top + mouseRect.height / 2
        };
        
        // Calculate distance between centers
        const distance = Math.sqrt(
            Math.pow(syringeCenter.x - mouseCenter.x, 2) + 
            Math.pow(syringeCenter.y - mouseCenter.y, 2)
        );
        
        // Define a closer proximity requirement (adjust this value as needed)
        const proximityThreshold = Math.min(mouseRect.width, mouseRect.height) * 0.25;
        
        // Check if syringe is within the required proximity of the mouse
        if (distance < proximityThreshold && isClicked) {
            // Collision detected - switch to happy mouse
            sadMouse.style.display = 'none';
            happyMouse.style.display = 'block';
            
            // Update the text in the text-container
            updateSuccessText();
            
            // Animation effect
            syringe.style.transform = 'scale(0.75) rotate(0deg)';
            setTimeout(() => {
                syringe.style.transform = 'scale(0.75) rotate(0deg)';
            }, 200);
            
            // Trigger confetti and fireworks
            triggerConfetti();
            
            // End dragging
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchmove', dragTouch);
            document.removeEventListener('touchend', endDragTouch);
        }
    }
    
    function updateSuccessText() {
        const textContainer = document.getElementById('text-container');
        // Clear existing text
        textContainer.innerHTML = '';
        
        // Add success message
        const successText = document.createElement('p');
        successText.textContent = 'Good job!! You have successfully inhibited Tommy\'s USAG-1 protein, allowing him to regrow his teeth. Thanks for learning about tissue engineering and Toregem!';
        successText.style.color = '#4CAF50'; // Green color for success
        
        // Add animation to the text
        textContainer.classList.add('success-animation');
        textContainer.style.borderColor = '#4CAF50';
        textContainer.appendChild(successText);
        
        // Show the Play Again button after a short delay
        setTimeout(() => {
            const playAgainButton = document.getElementById('play-again');
            playAgainButton.classList.add('show');
        }, 1500);
    }
    
    function triggerConfetti() {
        // Confetti explosion
        const duration = 5000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        
        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }
        
        // Create multiple confetti bursts for a more dramatic effect
        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            
            const particleCount = 50 * (timeLeft / duration);
            
            // Fireworks effect - burst from bottom to top
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#ff0000', '#ffff00', '#00ff00']
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#0000ff', '#ff00ff', '#ffffff']
            });
            
            // Regular confetti burst
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { x: randomInRange(0.4, 0.6), y: randomInRange(0.4, 0.6) }
            });
            
        }, 250);
        
        // Add some firecracker sound effects
        setTimeout(() => {
            // Simulate firework sounds with rapid succession
            playFireworkSound();
        }, 200);
    }
    
    function playFireworkSound() {
        // Create multiple firecracker sounds with varying pitches
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const audio = new Audio();
                audio.volume = 0.3;
                // Using oscillator for sound effect since we don't have actual audio files
                try {
                    const oscillator = audioCtx.createOscillator();
                    const gainNode = audioCtx.createGain();
                    
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(400 + Math.random() * 800, audioCtx.currentTime);
                    oscillator.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                    
                    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
                    
                    oscillator.start();
                    oscillator.stop(audioCtx.currentTime + 0.5);
                } catch (e) {
                    console.log("Audio context not supported");
                }
            }, i * 200);
        }
    }

    function handleTouchDenture(e) {
        isDraggingDenture = true;
        isClickedDenture = true;
        const touch = e.touches[0];
        dentureOffsetX = touch.clientX - denture.getBoundingClientRect().left;
        dentureOffsetY = touch.clientY - denture.getBoundingClientRect().top;
        
        // Ensure syringe is on top during dragging
        denture.style.zIndex = '100';
        
        // Add event listeners for touch movement and end
        document.addEventListener('touchmove', dragTouchDenture);
        document.addEventListener('touchend', endDragTouchDenture);
        
        // Prevent default behavior to avoid scrolling during drag
        e.preventDefault();
    }
    
    function startDragDenture(e) {
        isDraggingDenture = true;
        isClickedDenture = true;
        dentureOffsetX = e.clientX - denture.getBoundingClientRect().left;
        dentureOffsetY = e.clientY - denture.getBoundingClientRect().top;
        
        // Ensure syringe is on top during dragging
        denture.style.zIndex = '100';
        
        // Add event listeners for mouse movement and release
        document.addEventListener('mousemove', dragDenture);
        document.addEventListener('mouseup', endDragDenture);
        
        // Prevent default behavior to avoid text selection during drag
        e.preventDefault();
    }

    function dragDenture(e) {
        if (isDraggingDenture) {
            denture.style.position = 'absolute';
            denture.style.left = `${e.clientX - dentureOffsetX}px`;
            denture.style.top = `${e.clientY - dentureOffsetY}px`;
            
            playIncorrectSound();

            // checkDentureCollision();
        }
    }
    
    function dragTouchDenture(e) {
        if (isDraggingDenture) {
            const touch = e.touches[0];
            denture.style.position = 'absolute';
            denture.style.left = `${touch.clientX - dentureOffsetX}px`;
            denture.style.top = `${touch.clientY - dentureOffsetY}px`;

            playIncorrectSound(); 

            // checkDentureCollision();

            e.preventDefault();
        }
    }
    
    function endDragDenture() {
        isDraggingDenture = false;
        // Return to normal z-index when not dragging
        denture.style.zIndex = '30';
        document.removeEventListener('mousemove', dragDenture);
        document.removeEventListener('mouseup', endDragDenture);
    }
    
    function endDragTouchDenture() {
        isDraggingDenture = false;
        // Return to normal z-index when not dragging
        denture.style.zIndex = '30';
        document.removeEventListener('touchmove', dragTouchDenture);
        document.removeEventListener('touchend', endDragTouchDenture);
    }
    

//     function startDragDenture(e) {
//         isDraggingDenture = true;
//         dentureOffsetX = e.clientX - denture.getBoundingClientRect().left;
//         dentureOffsetY = e.clientY - denture.getBoundingClientRect().top;
        
//         // Ensure denture is on top during dragging
//         denture.style.zIndex = '100';
        
//         // Add event listeners for mouse movement and release
//         document.addEventListener('mousemove', dragDenture);
//         document.addEventListener('mouseup', endDragDenture);
        
//         // Prevent default behavior to avoid text selection during drag
//         e.preventDefault();
//     }

//     function handleTouchDenture(e) {
//         isDraggingDenture = true;
//         const touch = e.touches[0];
//         dentureOffsetX = touch.clientX - denture.getBoundingClientRect().left;
//         dentureOffsetY = touch.clientY - denture.getBoundingClientRect().top;
        
//         // Ensure denture is on top during dragging
//         denture.style.zIndex = '100';
        
//         // Add event listeners for touch movement and end
//         document.addEventListener('touchmove', dragDentureTouch);
//         document.addEventListener('touchend', endDragDentureTouch);
        
//         // Prevent default behavior to avoid scrolling during drag
//         e.preventDefault();
//     }

//     function dragDenture(e) {
//         if (isDraggingDenture) {
//             denture.style.position = 'absolute';
//             denture.style.left = `${e.clientX - dentureOffsetX}px`;
//             denture.style.top = `${e.clientY - dentureOffsetY}px`;
            
//             checkDentureCollision();
//         }
//     }

//     function dragDentureTouch(e) {
//         if (isDraggingDenture) {
//             const touch = e.touches[0];
//             denture.style.position = 'absolute';
//             denture.style.left = `${touch.clientX - dentureOffsetX}px`;
//             denture.style.top = `${touch.clientY - dentureOffsetY}px`;
            
//             checkDentureCollision();
//             e.preventDefault();
//         }
//     }

//     function endDragDenture() {
//         isDraggingDenture = false;
//         // Return to normal z-index when not dragging
//         denture.style.zIndex = '30';
//         document.removeEventListener('mousemove', dragDenture);
//         document.removeEventListener('mouseup', endDragDenture);
//     }

//     function endDragDentureTouch() {
//         isDraggingDenture = false;
//         // Return to normal z-index when not dragging
//         denture.style.zIndex = '30';
//         document.removeEventListener('touchmove', dragDentureTouch);
//         document.removeEventListener('touchend', endDragDentureTouch);
//     }

    function checkDentureCollision() {
        // Get bounding rectangles
        const dentureRect = denture.getBoundingClientRect();
        const mouseRect = sadMouse.getBoundingClientRect();
        
        // Calculate centers
        const dentureCenter = {
            x: dentureRect.left + dentureRect.width / 2,
            y: dentureRect.top + dentureRect.height / 2
        };
        
        const mouseCenter = {
            x: mouseRect.left + mouseRect.width / 2,
            y: mouseRect.top + mouseRect.height / 2
        };
        
        // Calculate distance between centers
        const distance = Math.sqrt(
            Math.pow(dentureCenter.x - mouseCenter.x, 2) + 
            Math.pow(dentureCenter.y - mouseCenter.y, 2)
        );
        
        // Define a closer proximity requirement (adjust this value as needed)
        const proximityThreshold = Math.min(mouseRect.width, mouseRect.height) * 1.2;
        
        // Check if denture is within the required proximity of the mouse
        if (distance < proximityThreshold && isClickedDenture) {
            // Play incorrect sound
            playIncorrectSound();
            
            // // Animation effect
            // denture.style.transform = 'scale(0.8) rotate(180deg)';
            // setTimeout(() => {
            //     denture.style.transform = 'scale(1) rotate(180deg)';
            // }, 200);
            
            // Reset denture position to original position
            denture.style.position = 'absolute';
            denture.style.left = 'calc(60% - 75px)';
            denture.style.top = '1%';
            
            // End dragging and reset flags
            isDraggingDenture = false;
            isClickedDenture = false;
            
            // Remove event listeners
            document.removeEventListener('mousemove', dragDenture);
            document.removeEventListener('mouseup', endDragDenture);
            document.removeEventListener('touchmove', dragTouchDenture);
            document.removeEventListener('touchend', endDragTouchDenture);
        }
    }

    // Function to play incorrect sound
    function playIncorrectSound() {
        try {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            // Use a softer sine wave instead of sawtooth
            oscillator.type = 'sine';
            
            // Create a descending "boop" sound
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 note
            oscillator.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.3); // A3 note
            
            // Softer volume envelope
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.3);
        } catch (e) {
            console.log("Audio context not supported");
        }
    }
}); 
