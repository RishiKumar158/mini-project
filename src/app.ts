console.log("Mini Project");

// Validation
interface Validatable {
    value: string | number,
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    min?: number,
    max?: number
}

function validate(validatebleInput: Validatable) {
    let isValid = true;
    if(validatebleInput.required) {
        isValid = isValid && validatebleInput.value.toString().trim().length !== 0;
    }
    if(validatebleInput.minLength != null && typeof validatebleInput.value === 'string') {
        isValid = isValid && validatebleInput.value.length >= validatebleInput.minLength;
    }
    if(validatebleInput.maxLength != null && typeof validatebleInput.value === 'string') {
        isValid = isValid && validatebleInput.value.length <= validatebleInput.maxLength;
    }
    if(validatebleInput.min != null && typeof validatebleInput.value === 'number') {
        isValid = isValid && validatebleInput.value >= validatebleInput.min;
    }
    if(validatebleInput.max != null && typeof validatebleInput.value === 'number') {
        isValid = isValid && validatebleInput.value <= validatebleInput.max;
    }
    return isValid
}

// autobind Decorator
function AutoBind(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boudFn = originalMethod.bind(this);
      return boudFn;
    },
  };
  return adjDescriptor;
}

//ProjectInput Class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";
    this.titleInputElement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;
    this.configure();
    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
        value: enteredTitle,
        required: true
    }
    
    const descriptionValidatable: Validatable = {
        value: enteredDescription,
        required: true,
        minLength: 5,
    }

    const peopleValidatable: Validatable = {
        value: +enteredPeople,
        required: true,
        min: 1,
        max: 5
    }
    

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable) 
    ) {
      alert("Invalid input, Please try again!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      this.clearInputs();
    }
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
