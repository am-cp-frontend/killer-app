<template>
    <div class="app">
    	<button class="chatChanger" v-on:click="changeChat()"></button>
        <vue-perfect-scrollbar  class="wrapper">
        	<div class="chat">
	        	<div v-for="messages in (victimChatOpened)? victimChat : killerChat" v-bind:class="['message', messages.value  ? 'friend' : 'me']">
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
			victimChatOpened: true
		}
	},
	components: {
		VuePerfectScrollbar
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
				if (this.$data.victimChatOpened)
					this.$data.victimChat.push({
						value: 0,
						message : input.value
					});
				else 
					this.$data.killerChat.push({
						value: 0,
						message : input.value
					});
				input.value = "";
			}
		},
		changeChat: function() {
			this.$data.victimChatOpened = !this.$data.victimChatOpened;	
		},
		createWebSocket: function() {

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
		font-family: "Arial";
	}

	.scroll-area {
	  position: relative;
	  margin: auto;
	  width: 400px;
	  height: 300px;
	}

	.chat {
		background-color: white;
		font-size: 1.2rem;
		display: flex;
		justify-content: flex-end;
		flex-direction: column;
		padding-left: 1.5rem;
		padding-right: 0.5rem;
	}

	.input {
		font-size: 1.2rem;
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
