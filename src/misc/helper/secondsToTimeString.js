export default function secondsToTimeString(totalSecondsCount) {
    // get time in better format
    const totalHours = Math.floor(totalSecondsCount / 3600);
    const totalMinutes = Math.floor((totalSecondsCount - (totalHours * 3600)) / 60);
    const totalSeconds = totalSecondsCount - totalHours * 3600 - totalMinutes * 60;

    return `${totalHours > 0 ? `${totalHours}:` : ""}${totalMinutes.toString().padStart(2, "0")}:${totalSeconds.toString().padStart(2, "0")}`;
}