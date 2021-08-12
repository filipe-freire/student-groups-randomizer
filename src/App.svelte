<script lang="ts">
  import { notifications } from "./notifications";
  import Toast from "./components/Toast.svelte";

  function generateRandomNumber(lower: number, upper: number) {
    return Math.floor(Math.random() * (upper + 1 - lower)) + lower;
  }
  // Creates groups of 2 people by default
  function createGroups() {
    if (!students.length || numOfMembers <= 0) return;
    const studentsCopy = [...students];
    const finalGroups = [];

    while (studentsCopy.length > 0) {
      const group = [];
      for (let i = 0; i < numOfMembers; i++) {
        const randomIndex = generateRandomNumber(0, studentsCopy.length - 1);
        if (studentsCopy.length) {
          group.push(studentsCopy[randomIndex]);
          studentsCopy.splice(randomIndex, 1);
        } else {
          break;
        }
      }
      finalGroups.push(group);
    }
    groups = [...finalGroups];
    console.log(groups);
  }
  function createClass() {
    const value = studentsInput.split(",").map((student) => {
      const normalizedName = student.trim().toLowerCase();
      return normalizedName[0].toLocaleUpperCase() + normalizedName.slice(1);
    });
    students = [...students, ...value];
  }
  function handleReturn(e) {
    if (e.code === "Enter") {
      createClass();
      studentsInput = "";
    }
  }
  function saveClass() {
    window.localStorage.setItem("class", students.join(" , "));
  }
  function loadPreviousClass() {
    const savedClass = window.localStorage.getItem("class").split(" , ");
    students = [...savedClass];
  }
  function copyGroupsToClipboard() {
    let string = "";

    groups.forEach((group, i) => {
      string += `Group ${i + 1}: ${group.join(" - ")}` + "\n";
    });

    navigator.clipboard.writeText(string);
    notifications.success("Groups successfully copied to clipboard! 🎉", 3000);
  }
  function resetData() {
    students.length = 0;
    groups.length = 0;

    notifications.info("Data was cleared! ✅", 3000);
  }

  let studentsInput = "";
  let students = [];
  let groups = [];
  let numOfMembers = 2;
</script>

<main>
  <Toast />
  <h1>Student Groups Randomizer!</h1>

  <h2>Students</h2>

  <!-- Check LocalStorage for previous saved class and display btn -->
  {#if window.localStorage.getItem("class")}
    <button on:click={() => loadPreviousClass()}>Load previous class</button>
    <br />
  {/if}

  <label for="addStudent"><i class="fas fa-user" /> Student(s) </label>
  <div class="inputContainer">
    <input
      id="addStudent"
      type="text"
      placeholder="Ex: student1, student2, student3..."
      bind:value={studentsInput}
      on:keyup={(e) => handleReturn(e)}
    />
  </div>

  <div class="btnContainer">
    <button on:click={() => createClass()}>Add Student(s)</button>
    <button class="danger" on:click={() => resetData()}>Reset</button>
  </div>
  <br />

  <!-- Set Number of Group Members -->
  {#if students.length > 1}
    <div class="inputContainer">
      <label for="numOfMembers"
        >How many members do you want the groups to have?</label
      >
      <input id="numOfMembers" bind:value={numOfMembers} type="number" />
    </div>
    <button on:click={() => createGroups()}>Create groups</button>
    <button class="save" on:click={() => saveClass()}> Save Class! </button>
  {/if}

  <!-- Students on the list -->
  <h2>List of students:</h2>
  {#if students.length === 0}
    <p>You're class is empty, please add students.</p>
  {:else}
    <ol>
      {#each students as student}
        <li>{student}</li>
      {/each}
    </ol>
  {/if}

  <!-- Final Groups -->
  {#if groups.length}
    <h2>Final Groups</h2>
    {#each groups as group, i}
      <p class="group"><b>Group {i + 1}</b>: {group.join(" - ")}</p>
    {/each}

    <!-- Copy Groups to Clipboard -->
    <button on:click={() => copyGroupsToClipboard()}
      >Copy Groups to Clipboard!</button
    >
  {/if}
</main>

<style>
  main {
    max-width: 1440px;
    margin: 0 auto;
    padding: 1em 3rem 3em;
  }
  h1 {
    text-align: center;
    margin: 2em auto;
    word-wrap: break-word;
  }
  h2 {
    margin: 1em auto;
  }
  button {
    padding: 1ch 2ch;
    border: 2px solid hsl(209, 36%, 47%);
    background-color: hsl(209, 80%, 70%);
    color: hsl(0, 0%, 100%);
    font-weight: 600;
    border-radius: 5px;
    text-transform: uppercase;
    letter-spacing: 1.8px;
    box-shadow: rgba(17, 17, 26, 0.05) 0px 1px 0px,
      rgba(17, 17, 26, 0.1) 0px 0px 8px;
    cursor: pointer;
    transition: all 100ms ease-out;
  }
  /* button + button {
    margin-left: 1em;
  } */
  .btnContainer {
    display: flex;
    justify-content: space-between;
    max-width: 290px;
  }

  button:focus,
  button:hover,
  button:active {
    border: 2px solid hsl(209, 46%, 23%);
    background-color: hsl(209, 60%, 50%);
  }

  button:hover {
    transform: translateY(-3px);
  }
  button.danger {
    border: 2px solid hsl(0, 76.6%, 26.9%);
    background-color: hsl(0, 50.4%, 55%);
  }
  button.danger:hover,
  button.danger:active {
    border: 2px solid hsl(0, 66%, 19%);
    background-color: hsl(0, 76%, 40%);
  }

  button.save {
    background-color: hsl(98, 38%, 50%);
    border: 2px solid hsl(120, 83%, 25%);
  }
  button.save:hover,
  button.save:active {
    background-color: hsl(98, 38%, 40%);
    border: 2px solid hsl(104.7, 64.6%, 15.5%);
  }

  input {
    padding: 1ch 2ch;
    border: 2px solid rgb(156, 191, 224);
    border-radius: 5px;
    letter-spacing: 0.8px;
    box-shadow: rgba(17, 17, 26, 0.05) 0px 1px 0px,
      rgba(17, 17, 26, 0.1) 0px 0px 8px;
  }

  input[type="number"] {
    border: 2px solid hsla(263, 48%, 54%, 0.8);
  }

  input {
    width: 100%;
    display: block;
  }

  .inputContainer {
    margin-top: 1em;
    margin-bottom: 1em;
    display: flex;
    align-items: center;
    max-width: 200px;
  }
  /* .inputContainer > input {
    margin-left: 2em;
  } */

  p.group {
    font-size: 1.1rem;
  }
  p.group + p.group {
    margin-top: 1em;
  }
  p.group:last-of-type {
    margin-bottom: 1em;
  }

  @media screen and (max-width: 400px) {
    .btnContainer {
      flex-direction: column;
      justify-content: space-between;
      /* background-color: aqua; */
      min-height: 80px;
      max-width: 200px;
      margin: 0 auto;
    }
  }
</style>
