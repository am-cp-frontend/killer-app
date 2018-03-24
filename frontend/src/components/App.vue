<template>
    <div class="app">
        <VuePerfectScrollbar  class="chat" v-on:onload="createScrollBar()">
			<div class="message me">
				Люстра́ция (от лат. lustratio — очищение посредством жертвоприношения) — законодательные ограничения, вводимые после смены власти для ограничения прав сторонников прежней власти[1]. Будучи не новым явлением (например, сталинские чистки, денацификация в Западной Европе[1], хрущёвская десталинизация[2]), «решительные формы»[1] люстрация приняла в конце XX века и начале XXI века в посткоммунистических государствах Восточной и Центральной Европы в виде недопущения на государствявлением (например, сталинские чистки, денацификация в Западной Европе[1], хрущёвская десталинизация[2]), «решительные формы»[1] люстрация приняла в конце XX века и начале XXI века в посткоммунистических государствах Восточной и Центральной Европы в виде недопущения на государственную службу, в аппарат государственного управления, правоохранительные органы, на иные важные посты и в учреждения сист	явлением (например, сталинские чистки, денацификация в Западной Европе[1], хрущёвская десталинизация[2]), «решительные формы»[1] люстрация приняла в конце XX века и начале XXI века в посткоммунистических государствах Восточной и Центральной Европы в виде недопущения на государственную службу, в аппарат государственного управления, правоохранительные органы, на иные важные посты и в учреждения сист	явлением (например, сталинские чистки, денацификация в Западной Европе[1], хрущёвская десталинизация[2]), «решительные формы»[1] люстрация приняла в конце XX века и начале XXI века в посткоммунистических государствах Восточной и Центральной Европы в виде недопущения на государственную службу, в аппарат государственного управления, правоохранительные органы, на иные важные посты и в учреждения сист	енную службу, в аппарат государственного управления, правоохранительные органы, на иные важные посты и в учреждения сист	
			</div>

			<div class="message friend">
				Всем привет! Это мое6 первое сообщение.					
			</div>
		</VuePerfectScrollbar>
		<textarea class="input" placeholder="Пиши, убивай"  v-on:keydown.enter="sendMessage($event)"/>
    </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
export default {
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
				let message = document.createElement("div");
				document.querySelector(".chat").appendChild(message);
				message.classList.add("me","message");
				message.textContent = input.value;
				input.value = "";
			}
		}
	}
}

</script>



<style>
	.chat , .input {
		font-family: "Serif";
		width: 75%;
		font-size: 1.2rem;

	}

	.scroll-area {
	  position: relative;
	  margin: auto;
	  width: 400px;
	  height: 300px;
	}

	.chat {
		background-color: white;
		height: 10rem;
		display: flex;
		justify-content: flex-end;
		flex-direction: column;
		overflow: hidden;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		position: absolute;
	}

	.input {
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
		margin-right: 1.5rem;
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
