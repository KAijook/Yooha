export const authMe = async (req, res) => {
    try {
	return res.status(200).json({
		message: 'You are authenticated!',
		user: req.user,
	});
    } catch (error) {
        console.log(error, 'Error in authMe controller');
        res.status(500).json({ message: 'Error occurred while authenticating' });
    }
}