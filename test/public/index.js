async function fetchDirectoryContent(path = "") {
  try {
    const response = await fetch(`/api/repo-content?path=${path}`);
    const data = await response.json();

    const list = document.createElement("ul");
    data.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item.name;

      if (item.type === "dir") {
        // Create an expand button for directories
        const expandButton = document.createElement("button");
        expandButton.textContent = "Expand";
        expandButton.onclick = () => expandDirectory(listItem, item.path);
        listItem.appendChild(expandButton);
      }

      list.appendChild(listItem);
    });

    return list;
  } catch (error) {
    console.error("Error fetching directory content:", error);
    return document.createTextNode("Failed to load content.");
  }
}

async function expandDirectory(listItem, path) {
  // Prevent double-fetching by removing the expand button after it is clicked
  const button = listItem.querySelector("button");
  if (button) {
    button.remove();
  }

  const subContent = await fetchDirectoryContent(path);
  listItem.appendChild(subContent);
}

// Initial call to fetch the root directory (empty path indicates the root)
window.onload = async () => {
  const rootContent = await fetchDirectoryContent("");
  document.getElementById("repo-content").appendChild(rootContent);
};
