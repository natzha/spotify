import { createShowMoreItemsButton } from "./CreateShowMoreItemsButton";

export function createTopListSection(sectionId: string, listId: string, sectionTitle: string, onChangeAction: any) {
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

    // duration slider
    const sliderDurationDiv = document.createElement("div");
    sliderDurationDiv.innerHTML = "How Long Ago: <span class='slider-duration-counter" + sectionId + "'></span>";
    sliderDurationDiv.className = "slider-holder"
    const sliderDuration = document.createElement("input");
    sliderDuration.type = "range";
    sliderDuration.min = "1";
    sliderDuration.max = "3";
    sliderDuration.value = "1";
    sliderDuration.id = "slider-duration";

    // show more button multiplier
    var itemMultiplier = 0;
    var onChangeInputs = {
        "itemMultiplier": itemMultiplier,
        "duration": Number(sliderDuration.value),
        "clearArray": false,
    }

    // duration event listener
    sliderDuration.addEventListener("change", () => {
        // clear the ul list (array), set multiple back to zero, change the duration 
        itemMultiplier = 0;
        onChangeInputs.itemMultiplier = itemMultiplier;
        onChangeInputs.duration = Number(sliderDuration.value);
        onChangeInputs.clearArray = true;
        onChangeAction(onChangeInputs);
        onChangeInputs.clearArray = false;

        // edit the ui display to be readable
        const displayCounterElements = document.querySelectorAll(".slider-duration-counter" + sectionId);
        displayCounterElements.forEach((element) => {
            var duration = "";
            switch (sliderDuration.value) {
                case "1": {
                    duration = "Past Month"
                    break;
                }
                case "2": {
                    duration = "Past 6 Months"
                    break;
                }
                case "3": {
                    duration = "Past Year"
                    break;
                }
                default: {
                    duration = "Past Month"
                    break;
                }
            };
            (element as HTMLElement).innerText = duration;
        });

        
    });

    // add slider to section
    sliderDurationDiv.appendChild(sliderDuration);
    sliderDiv.appendChild(sliderDurationDiv);
    section.appendChild(sliderDiv);

    // Create list
    const htmlList = document.createElement('ul');
    htmlList.id = listId;
    htmlList.className = "standard-list";
    section.appendChild(htmlList);
    
    // show more button
    var buttonElement = createShowMoreItemsButton(listId, onChangeAction, onChangeInputs);
    section.appendChild(buttonElement)

    // set section into document
    document.body.appendChild(section);

    // trigger a slider event
    // sliderNumItems.dispatchEvent(new Event('change'));
    sliderDuration.dispatchEvent(new Event('change'));
}

