module.exports = {
    /**
     * @param ping
     * @return {string}
     */
    pingStatus(ping) {
        if (ping < 100) {
            return 'Excellent';
        }
        if (ping < 200) {
            return 'Very Good';
        }
        if (ping < 500) {
            return 'Good';
        }
        if (ping < 1000) {
            return 'Mediocre';
        }
        return 'Bad';
    },
};
