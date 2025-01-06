document.getElementById("image-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const prompt = document.getElementById("prompt").value;
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
  
    const data = await response.json();
    const imageContainer = document.getElementById("image-container");
    if (data.error) {
      imageContainer.innerHTML = `<p style="color:red;">${data.error}</p>`;
    } else {
      imageContainer.innerHTML = `<img src="${data.url}" alt="Generated Image">`;
    }
  });
  