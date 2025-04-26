document.getElementById('tipButton').addEventListener('click', async () => {
    const response = await fetch('http://localhost:5000/get-tip');
    const data = await response.json();
    document.getElementById('tipArea').innerText = data.tip;
});

