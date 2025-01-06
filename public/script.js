document.getElementById("image-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const prompt = document.getElementById("prompt").value;
  
    try {
      // Send the request to the server
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
  
      const data = await response.json();
      const imageContainer = document.getElementById("image-container");
      const downloadButton = document.getElementById("download-button");
  
      // Check for errors in the response
      if (!response.ok) {
        alert(data.error || "An error occurred while processing your request.");
        return;
      }
  
      // Display the generated image if successful
      imageContainer.innerHTML = `<img src="${data.url}" alt="Generated Image">`;
      downloadButton.style.display = 'block'; // Show the download button
      downloadButton.onclick = () => {
        const link = document.createElement('a');
        link.href = data.url; // Use the image URL
        link.download = 'generated-image.png'; // Set the default file name
        link.target = '_self'; // Ensure the link behavior is controlled
        document.body.appendChild(link); // Append the link to the DOM
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up
    };
    
    } catch (error) {
      // Handle network or other unexpected errors
      alert("Something went wrong. Please try again later.");
      console.error("Error:", error);
    }
  });
  