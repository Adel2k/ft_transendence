export function createPaddle(): HTMLElement {
  const paddle = document.createElement('div');
  paddle.className = 'absolute inset-0 flex items-center justify-center opacity-100';
  paddle.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" class="w-[1200px] h-[1200px]" style="transform: translateY(-75px);">
      <defs>
        <pattern id="rubber-texture-red" patternUnits="userSpaceOnUse" width="10" height="10">
          <circle cx="5" cy="5" r="2" fill="rgba(211, 47, 47, 0.5)" />
          <circle cx="5" cy="5" r="1" fill="rgba(102, 13, 13, 0.3)" />
        </pattern>
      </defs>
      <g transform="rotate(-45, 300, 300)">
        <rect x="185" y="300" width="30" height="180" fill="#8d6e63" stroke="#6d4c41" stroke-width="4" />
        <rect x="185" y="298" width="4" height="180" fill="#a1887f" />
        <rect x="195" y="298" width="8" height="180" fill="#0d47a1" />
        <rect x="185" y="440" width="30" height="20" fill="#000000" />
        <rect x="185" y="447.5" width="30" height="5" fill="#ffffff" />
        <ellipse cx="200" cy="200" rx="120" ry="100" fill="#d32f2f" transform="rotate(90, 200, 200)"/>
        <ellipse cx="200" cy="200" rx="123" ry="103" fill="none" stroke="#b71c1c" stroke-width="9" transform="rotate(90, 200, 200)" /> 
        <ellipse cx="200" cy="200" rx="118" ry="98" fill="url(#rubber-texture-red)" transform="rotate(90, 200, 200)"/>
      </g>
      <defs>
        <pattern id="rubber-texture-blue" patternUnits="userSpaceOnUse" width="10" height="10">
          <circle cx="5" cy="5" r="2" fill="rgba(25, 118, 210, 0.5)" />
          <circle cx="5" cy="5" r="1" fill="rgba(22, 71, 121, 0.3)" />
        </pattern>
      </defs>
      <g transform="rotate(45, 300, 300)">
        <rect x="385" y="300" width="30" height="180" fill="#8d6e63" stroke="#6d4c41" stroke-width="4" />
        <rect x="410" y="298" width="4" height="180" fill="#a1887f" />
        <rect x="395" y="298" width="8" height="180" fill="#b71c1c" />
        <rect x="385" y="440" width="30" height="20" fill="#000000" />
        <rect x="385" y="447.5" width="30" height="5" fill="#ffffff" />
        <ellipse cx="400" cy="200" rx="120" ry="100" fill="#1976d2" stroke="#0d47a1" transform="rotate(90, 400, 200)"/>
        <ellipse cx="400" cy="200" rx="123" ry="103" fill="none" stroke="#0d47a1" stroke-width="9" transform="rotate(90, 400, 200)"/>
        <ellipse cx="400" cy="200" rx="118" ry="98" fill="url(#rubber-texture-blue)" transform="rotate(90, 400, 200)"/>
      </g>
    </svg>`;
  paddle.style.userSelect = 'none';
  return paddle;
}