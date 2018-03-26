<template>
    <div class="app">
        <button class="chatChanger" v-on:click="changeChat()"></button>
        <vue-perfect-scrollbar  class="wrapper">
            <div class="chat">
                <div v-for="messages in this.$data[currentChat]" v-bind:class="['message', messages.value ? 'friend' : 'me']">
                        {{messages.message}} 
                </div>
            </div>
        </vue-perfect-scrollbar>
        <textarea class="input" placeholder="Пиши, убивай"  v-on:keydown.enter="sendMessage($event)"/>
    </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
export default {
    data (){
        return {
            killerChat: [{
                value: 0,
                message: 'ti pidor'
            }, {
                value: 1,
                message: 'net ti'
            }],
            victimChat: [{
                value: 0,
                message: 'ti lox'
            }, {
                value: 1,
                message: 'net ti lox'
            }],
            currentChat: "victimChat",
            socket : {}
        }
    },
    components: {
        VuePerfectScrollbar
    },
    mounted: function() {
        this.$data.socket = new WebSocket("ws://");
        this.$data.socket.onmessage = function(event) {
            this.$data[event.data.currentChat].push({
                value: 1,
                message : event.data.message
            })
        };
        this.$data.socket.onerror = function(e) {
            console.log("Error occured: " + e.message);
        }
    },
    methods: {
        formate: function()  {
            let textarea = document.querySelector(".input");
            textarea.style.height = "0rem";
            textarea.style.height = (textarea.scrollHeight)+"px";
        },
        sendMessage: function(event) {
            event.preventDefault();    
            let input = document.querySelector(".input");
            if (input.value) {
                let message = 
                this.$data[this.$data.currentChat].push({
                    value: 0,
                    message : input.value
                });
                input.value = "";
                this.$data.socket.send({
                    currentChat: this.$data.currentChat,
                    message : input.value
                })
                setTimeout(this.rescroll,0);

            }
        },

        changeChat: function() {
            if (this.$data.currentChat === "killerChat")
                this.$data.currentChat = "victimChat";
            else 
                this.$data.currentChat = "killerChat";
        },
        rescroll: function() {
            let scrollbar = document.querySelector(".wrapper");
            scrollbar.scrollTop = scrollbar.scrollHeight;
        }
    }
}

</script>


<style>
    .wrapper {
        height: 30rem;
        width: 75%;

    }
    
    .chatChanger {
        width: 75%;
        height: 2rem;
    }

    .chat , .input {
        font-family: "Roboto Light";
        font-size: 16px;
    }

    .chat {
        background-color: #000000;
        color: #675f6d;
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        padding-left: 1.5rem;
        padding-right: 0.5rem;
    }

    .input {
        width: 75%;
        resize: none;
        outline: none;
        height: 1.2rem;
        padding-top: 1.5rem;
        overflow: hidden;
        border: 0;
        border-bottom: 0.15rem solid purple;
    }

    .message {        
        border: 0.09rem solid #c5c5e3;
        border-radius: 0.1rem;
        padding: 0.6rem;
        max-width: 65%;
        margin-top: 0.6rem;
        word-wrap: break-word;
    }
    
    .me {
        margin-right: 1rem;
        align-self: flex-end;
        text-align: right;
        background-color: azure;
    }

    .friend{
        align-self: flex-start;
        background-color: #ccccff;
        text-align: left;
    }
</style>
