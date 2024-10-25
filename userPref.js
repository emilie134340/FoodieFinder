async function fourSquare(cuisine, minPrice, maxPrice, location) {
    const response = await fetch('API GATEWAY DEPLOYED w/ CORS URL', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "cuisine": cuisine,
            "minPrice": minPrice,
            "maxPrice": maxPrice,
            "location": location
        })
    });

    const responseData = await response.json();
    const parsedData = JSON.parse(responseData.body);
    console.log(parsedData); //check what gets returned

    const lines = parsedData.lines;
    // how to format response??
    const restaurants = lines.join(' ')
    console.log(restaurants);
    return restaurants;
}
