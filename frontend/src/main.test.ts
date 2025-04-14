const { render, screen } = require('@testing-library/react');
const App = require('../App'); // Adjust the import based on your main component's location

test('hello world!', () => {
	render(<App />);
	const linkElement = screen.getByText(/hello world/i);
	expect(linkElement).toBeInTheDocument();
});