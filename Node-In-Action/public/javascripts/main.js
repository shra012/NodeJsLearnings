$(function () {
    const $h1 = $("h1");
    const $zip = $("input[name='zip']");
    $("form").on("submit", function (event) {
        event.preventDefault();
        const zipCode = $.trim($zip.val());
        $h1.text("Loading...");
        const request = $.ajax({
            url: `/weather/zipcode/${zipCode}`,
            dataType: "json"
        });
        request.done(function (data) {
            const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(2);
            const temperature = kelvinToCelsius(data.main.temp);
            const place = data.name
            $h1.html(`Weather at ${place} is ${temperature} &#176; with ${zipCode}.`);
        });
        request.fail(function () {
            $h1.text("Error!");
        });
    });
});