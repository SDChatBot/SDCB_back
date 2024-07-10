export const CurrentTime = () =>{
    const now=new Date();

    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    const formattedTime = `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

    return formattedTime;
}

