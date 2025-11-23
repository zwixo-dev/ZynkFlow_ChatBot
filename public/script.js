  const button = document.querySelector("button");
  const input = document.querySelector("input");
  const container = document.querySelector(".conatiner");

  // const fisrtMsg = document.querySelector(".firstMsg");
  
  button.addEventListener("click", async (event) => {
    event.preventDefault();

    const message = input.value.trim();
    if (!message) return;

    //
    const userQst = document.createElement("p");
    userQst.textContent = message;
    userQst.classList.add("userQst");
    container.appendChild(userQst);

    //
    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      //
      const botAnswer = document.createElement("p");
      botAnswer.textContent = data.answer;
      botAnswer.classList.add("botAnswer");
      container.appendChild(botAnswer);

    } catch (error) {
      console.error(error);

      const errMsg = document.createElement("p");
      errMsg.textContent = "Error: server not responding.";
      errMsg.classList.add("botError");
      container.appendChild(errMsg);
      container.scrollTop = container.scrollHeight;
    }

    input.value = "";
  });