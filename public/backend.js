// UI Logic
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");

// Show selected file names
fileInput.addEventListener("change", async () => {
  const files = fileInput.files;
  if (!files.length) return;

  // Show selected files
  const fileList = document.getElementById("fileList");
  fileList.innerText = Array.from(files).map(f => f.name).join(", ");

  // Prepare FormData
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  try {
    const res = await fetch("/upload/file", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    console.log(data); // logs success message
  } catch (err) {
    console.error("Upload failed:", err);
  }
});

// function indexData() {
//   const btn = event.target;
//   const originalText = btn.innerHTML;
//   btn.innerHTML =
//     '<i class="fa-solid fa-circle-notch animate-spin"></i> Processing...';
//   btn.disabled = true;

//   // Simulate Indexing Delay
//   setTimeout(() => {
//     alert("Data successfully chunked and stored in Vector DB!");
//     btn.innerHTML = originalText;
//     btn.disabled = false;
//   }, 1500);
// }
function indexData() {
  const text = document.getElementById("textSource").value.trim();
  if (!text) {
    alert("Please enter some text to index!");
    return;
  }

  // You can call your backend API to index text here
  fetch("/users/index-text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userInput : text })
  })
    .then(res => res.json())
    .then(data => {
      alert("Text indexed successfully!");
      document.getElementById("textSource").value = ""; // optional clear
    })
    .catch(err => {
      console.error(err);
      alert("Text indexing failed!");
    });
}


async function handleSendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) {
        console.log("no text received at backend!!!");
    }
    console.log(text);
 // User Message
    addMessage(text, "user");
    userInput.value = "";

    try {
        const reply = await fetch("/users/chat",{
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify({query : text}),
        })

        const data = await reply.json();
        addMessage(data.reply,"bot");
    } catch (error) {
        console.log(error);
        addMessage("server error encountered please try again later!!!");
    }

    // Simulate RAG Logic (Retrieval -> Generation)
    // setTimeout(() => {
    //     addMessage("Based on the uploaded documents, here is the answer: [This is a simulated RAG response.]","bot");
    // }, 1000);
}

function addMessage(text, role) {
  const div = document.createElement("div");
  div.className =
    role === "user"
      ? "flex gap-3 max-w-3xl ml-auto flex-row-reverse"
      : "flex gap-3 max-w-3xl";

  const icon = role === "user" ? "fa-user" : "fa-robot";
  const bgColor =
    role === "user"
      ? "bg-blue-600 text-white"
      : "bg-white border border-slate-200 text-slate-700";
  const radius =
    role === "user"
      ? "rounded-2xl rounded-tr-none"
      : "rounded-2xl rounded-tl-none";

  div.innerHTML = `
                <div class="w-8 h-8 rounded-full ${
                  role === "user"
                    ? "bg-slate-200 text-slate-600"
                    : "bg-blue-100 text-blue-600"
                } flex items-center justify-center shrink-0">
                    <i class="fa-solid ${icon} text-sm"></i>
                </div>
                <div class="${bgColor} p-3 ${radius} shadow-sm">
                    ${text}
                </div>
            `;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function clearChat() {
  chatWindow.innerHTML = "";
}

// Support Enter key
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSendMessage();
});



