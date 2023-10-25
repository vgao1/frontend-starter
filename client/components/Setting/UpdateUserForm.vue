<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

let username = ref("");
let password = ref("");
let newModeratorUsername = ref("");
let existingModeratorUsername = ref("");

const { updateUser, updateSession } = useUserStore();

async function updateUsername() {
  await updateUser({ username: username.value });
  await updateSession();
  username.value = "";
}

async function updatePassword() {
  await updateUser({ password: password.value });
  await updateSession();
  password.value = "";
}

async function addModerator() {
  try {
    const moderatorUserObj = await fetchy(`/api/users/${newModeratorUsername.value}`, "GET");
    await fetchy("/api/addModerator", "POST", {
      body: { userToAdd: moderatorUserObj._id },
    });
  } catch (_) {
    return;
  }
  newModeratorUsername.value = "";
}

async function removeModerator() {
  try {
    const moderatorUserObj = await fetchy(`/api/users/${existingModeratorUsername.value}`, "GET");
    await fetchy(`/api/removeModerator/${moderatorUserObj._id}`, "POST");
  } catch (_) {
    return;
  }
  newModeratorUsername.value = "";
}
</script>

<template>
  <h2>Update user details</h2>
  <form @submit.prevent="updateUsername" class="pure-form">
    <fieldset>
      <legend>Change your username</legend>
      <input type="text" placeholder="New username" v-model="username" required />
      <button type="submit" class="pure-button">Update username</button>
    </fieldset>
  </form>

  <form @submit.prevent="updatePassword" class="pure-form">
    <fieldset>
      <legend>Change your password</legend>
      <input type="password" placeholder="New password" v-model="password" required />
      <button type="submit" class="pure-button">Update password</button>
    </fieldset>
  </form>

  <form @submit.prevent="addModerator" class="pure-form">
    <fieldset>
      <legend>Add New Moderator</legend>
      <input type="text" placeholder="Moderator username" v-model="newModeratorUsername" required />
      <button type="submit" class="pure-button">Add Moderator</button>
    </fieldset>
  </form>

  <form @submit.prevent="removeModerator" class="pure-form">
    <fieldset>
      <legend>Remove Existing Moderator</legend>
      <input type="text" placeholder="Moderator username" v-model="existingModeratorUsername" required />
      <button type="submit" class="pure-button">Remove Moderator</button>
    </fieldset>
  </form>
</template>
