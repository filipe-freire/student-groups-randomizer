<script lang="ts">
  function generateRandomNumber(lower: number, upper: number) {
    return Math.floor(Math.random() * (upper + 1 - lower)) + lower;
  }
  // const students = [
  //   "Marie",
  //   "Cheryl",
  //   "Anna",
  //   "Amy",
  //   "Daniel",
  //   "Juan",
  //   "Noemi",
  //   "Chris",
  //   "Pablo",
  // ];
  const students = [];

  let studentsInput = "";

  function createClass() {
    const value = studentsInput.split(",").map((student) => {
      const normalizedName = student.trim();
      return normalizedName[0].toLocaleUpperCase() + normalizedName.slice(1);
    });
    value.forEach((el) => students.push(el));
  }

  const groups = [];

  function createGroups(numOfPeople) {
    const studentsCopy = [...students];

    while (studentsCopy.length > 0) {
      const group = [];
      for (let i = 0; i < numOfPeople; i++) {
        const randomIndex = generateRandomNumber(0, studentsCopy.length - 1);
        if (studentsCopy.length) {
          group.push(studentsCopy[randomIndex]);
          studentsCopy.splice(randomIndex, 1);
        } else {
          break;
        }
      }
      groups.push(group);
    }
  }

  // createGroups(2);
</script>

<main>
  <h1>Group Randomizer!</h1>

  <h2>Students</h2>
  <label for="addStudent">Add Students</label>
  <input
    id="addStudent"
    type="text"
    placeholder="student1, student2, student3..."
    bind:value={studentsInput}
  />
  <button on:click={() => createClass()}>Create Class</button>
  <br />
  <button on:click={() => createGroups(2)}>Create groups</button>

  <!-- Students on the list -->
  <h2>List of students:</h2>
  <ol>
    {#each students as student}
      <li>{student}</li>
    {/each}
  </ol>

  <!-- final groups -->
  {#each groups as group, i}
    <p><b>Group {i + 1}</b> - {group.join(" & ")}</p>
  {/each}
</main>
