export function convertCelsiusToFahrenheit(cel) {
    const result = (cel * 10) * (9 / 5) + 320;
    console.log(result)
    return Math.floor(result);
}
export function convertFahrenheitToCelsius(far) {
    const result = (far - 320) * ( 5 / 9 );
    return Math.floor(result) / 10;
}