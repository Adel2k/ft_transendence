export function createContent(): HTMLElement {
  const content = document.createElement('h1');
  content.textContent = 'Welcome to the Home Page!';
  content.className = 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center z-10 ml-16';

  const description = document.createElement('p');
  description.textContent = 'Explore the features of our application.';
  description.className = 'text-sm sm:text-base md:text-lg lg:text-xl text-center z-10';

  content.appendChild(description);

  return content;
}