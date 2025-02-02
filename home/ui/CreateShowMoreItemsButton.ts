export function createShowMoreItemsButton(listId: string, onChangeAction: any, onChangeInputs: any) {

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    const showMoreButton = document.createElement("button");
    showMoreButton.id = listId + "show-more-button";
    showMoreButton.className = "button-class";
    showMoreButton.textContent = "See More Items";

    let isProcessing = false;


    // event listener triggers action on click
    showMoreButton.addEventListener("click", async() => {
        if (isProcessing) return;
        isProcessing = true;

        onChangeInputs.itemMultiplier += 1;
        var output = await onChangeAction(onChangeInputs);

        if (output) {
            buttonContainer.removeChild(showMoreButton);
        } else {
            
            showMoreButton.textContent = "See More Items";

        }

        isProcessing = false;
    });

    buttonContainer.appendChild(showMoreButton);
    return buttonContainer;
}
