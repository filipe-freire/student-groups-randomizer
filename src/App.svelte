<script lang="ts">
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
      const normalizedName = student.trim();
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

  let studentsInput = "";
  let students = [];
  let groups = [];
  let numOfMembers = 2;
</script>

<main>
  <h1>Group Randomizer!</h1>

  <h2>Students</h2>
  <label for="addStudent">Student(s)</label>
  <input
    style="width: 200px;"
    id="addStudent"
    type="text"
    placeholder="student1, student2, student3..."
    bind:value={studentsInput}
    on:keyup={(e) => handleReturn(e)}
  />

  <button on:click={() => createClass()}>Add Student(s)</button>
  <button on:click={() => (students.length = 0)}>Reset</button>
  <br />

  <!-- Set Number of Group Members -->
  {#if students.length > 1}
    <label for="numOfMembers"
      >How many members do you want the groups to have?</label
    >
    <input id="numOfMembers" bind:value={numOfMembers} type="number" />
    <button on:click={() => createGroups()}>Create groups</button>
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
  {/if}
  {#each groups as group, i}
    <p><b>Group {i + 1}</b>: {group.join(" - ")}</p>
  {/each}
</main>
