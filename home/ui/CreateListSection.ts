export function createListSection(sectionId: string, listId: string, sectionTitle: string, onChangeAction: any) {
    // Create new album releases section
    const section = document.createElement('section');
    section.id = sectionId;
    section.className = "standard-section";

    // Create title
    const heading = document.createElement('h2');
    heading.innerHTML = sectionTitle;
    section.appendChild(heading);

    // slider all div
    const sliderDiv = document.createElement("div");
    sliderDiv.id = "slider-div";

    // number of items slider
    const sliderNumItemsDiv = document.createElement("div");
    sliderNumItemsDiv.innerHTML = "Show Max Number of Items: <span class='slider-num-items-counter" + sectionId + "'></span>";
    sliderNumItemsDiv.className = "slider-holder"
    const sliderNumItems = document.createElement("input");
    sliderNumItems.type = "range";
    sliderNumItems.min = "10";
    sliderNumItems.max = "200";
    sliderNumItems.value = "10";
    sliderNumItems.id = "slider-num-items";

    // num items event listener
    sliderNumItems.addEventListener("change", () => {
        onChangeAction(Number(sliderNumItems.value));

        const displayCounterElements = document.querySelectorAll(".slider-num-items-counter" + sectionId);
        displayCounterElements.forEach((element) => {
            (element as HTMLElement).innerText = sliderNumItems.value;
        });
    });


    sliderNumItemsDiv.appendChild(sliderNumItems);
    sliderDiv.appendChild(sliderNumItemsDiv);
    section.appendChild(sliderDiv);

    // Create list
    const htmlList = document.createElement('ul');
    htmlList.id = listId;
    htmlList.className = "standard-list"
    section.appendChild(htmlList);

    // set section into document
    document.body.appendChild(section);

    // trigger a slider event
    sliderNumItems.dispatchEvent(new Event('change'));
}
