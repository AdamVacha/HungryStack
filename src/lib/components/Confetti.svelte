<!-- src/lib/components/Confetti.svelte -->
<script lang="ts">
    export let onComplete = () => {};
    export let onError = (error: any) => {};
    
    // Function to play confetti animation
    export function playConfetti() {
      try {
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.zIndex = '9999';
        confettiContainer.style.pointerEvents = 'none';
        document.body.appendChild(confettiContainer);
  
        // Create 100 confetti pieces
        for (let i = 0; i < 100; i++) {
          setTimeout(() => {
            const confetti = document.createElement('div');
            const colors = [
              '#f94144', // red
              '#f3722c', // orange
              '#f8961e', // yellow-orange
              '#f9c74f', // yellow
              '#90be6d', // green
              '#43aa8b', // teal
              '#577590'  // blue
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
  
            // Randomize confetti shapes and sizes
            const size = 5 + Math.random() * 10;
            const isCircle = Math.random() > 0.5;
  
            confetti.style.position = 'absolute';
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.backgroundColor = color;
            confetti.style.borderRadius = isCircle ? '50%' : '0';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = '-10px';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
  
            confettiContainer.appendChild(confetti);
  
            // Animate falling with randomized parameters
            const animation = confetti.animate(
              [
                { transform: `translate(0, 0) rotate(0)` },
                { 
                  transform: `translate(${(Math.random() - 0.5) * 300}px, ${window.innerHeight + 10}px) rotate(${Math.random() * 720}deg)` 
                }
              ],
              {
                duration: 1500 + Math.random() * 3000,
                easing: 'cubic-bezier(.37,1.04,.68,.98)'
              }
            );
  
            animation.onfinish = () => {
              confetti.remove();
            };
          }, Math.random() * 1000); // Stagger the confetti appearance
        }
  
        // Remove the container after animation completes
        setTimeout(() => {
          confettiContainer.remove();
          onComplete();
        }, 6000);
  
        return true;
      } catch (error) {
        console.error('Failed to play confetti animation:', error);
        onError(error);
        return false;
      }
    }
  </script>