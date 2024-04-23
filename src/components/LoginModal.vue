<template>
    <div class="modal-body">
        <div class="login-container">
            <div class="login-message">
                {{ text }}
            </div>
            <div class="login-button">
                <button class="btn btn-primary" @click="login">Se connecter</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "LoginModal",
    props: {
        text: String
    },
    methods: {
        async login() {
            if (!this.$gapi.isAuthenticated()) {
                try {
                    await this.$gapi.login();
                    this.$emit('close')
                } catch (err) {
                    console.error("Login call failed: %s", err.message);
                }

            }
        },
    }
}
</script>

<style scoped>
.login-container {
    text-align: center;
}

.login-message {
    font-size: 1.2em;
    margin-bottom: 20px;
}

.login-button {
    margin-top: 20px;
}
</style>
