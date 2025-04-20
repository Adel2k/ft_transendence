function generateRandomAvatar(username) {
	const cleanUsername = username.replace(/[^a-zA-Z0-9]/g, '');
	const allowedSets = [1, 2, 3, 5];
	const set = `set${allowedSets[Math.floor(Math.random() * allowedSets.length)]}`;
	const bg = `bg${Math.floor(Math.random() * 2) + 1}`;
	return `${process.env.DEFAULT_AVATAR}${encodeURIComponent(cleanUsername)}?set=${set}&bgset=${bg}`;
}

export { generateRandomAvatar }