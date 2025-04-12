export function getRandomPastelColor(): string {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 85%)`;
}

export function createFloatingShape(container: HTMLElement): void {
  const shape = document.createElement('div');
  const size = Math.random() * 40 + 20;
  const delay = Math.random() * 5;
  const blur = Math.random() < 0.3;
  const zIndex = Math.random() < 0.3 ? 'z-0' : 'z-10';

  shape.style.width = `${size}px`;
  shape.style.height = `${size}px`;
  shape.style.left = `${Math.random() * 100}%`;
  shape.style.top = `${Math.random() * 100}%`;
  shape.style.opacity = `${Math.random() * 0.4 + 0.3}`;
  shape.style.backgroundColor = getRandomPastelColor();
  shape.style.animationDelay = `${delay}s`;
  shape.style.filter = blur ? 'blur(4px)' : 'none';

  shape.className = `absolute rounded-full animate-float-shape pointer-events-none ${zIndex}`;
  container.appendChild(shape);

  setTimeout(() => {
    shape.remove();
  }, 45000);
}