export default function secondsToTimeString(totalSecondsCount) {
    // get time in better format
    const totalHours = Math.floor(totalSecondsCount / 3600);
    const totalMinutes = Math.floor((totalSecondsCount - (totalHours * 3600)) / 60);
    const totalSeconds = totalSecondsCount - totalHours * 3600 - totalMinutes * 60;
    return `${totalHours > 0 ? `${totalHours}h:` : ""}${totalMinutes > 0 ? `${totalMinutes}m:` : ""}${totalSeconds}s`;
}