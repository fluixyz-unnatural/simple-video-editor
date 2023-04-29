export function clearSelection() {
  const selection = document.getSelection();
  selection?.empty();
}
