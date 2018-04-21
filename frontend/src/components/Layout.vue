<template>
    <div class='layout'>
        <div class='header' >
            <slot name='header'> </slot>
        </div>
        <div class='content' >
            <slot name='content'></slot>
        </div>
        <div class='footer'>
            <slot name='footer'></slot>
        </div>
    </div>
</template>

<script>
export default {
    name:'Layout',
}
</script>

<style lang="scss" scoped>
    @import '~@/utils/var.scss';
    .content {
        margin-top:$space--m;
        margin-bottom:$space--m;
        display:flex;
        flex-direction: column;
        justify-content: center;
    }
    .footer {
        display:flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
    }
    .header {
        text-align: center;
        font-family: $font-family--header;
        font-size: $font-size--header;
    }
    .layout {
        color:$font-color--main;
        font-family:$font-family--main;
        font-size:$font-size--main;
        margin-top:$space--l;
        margin-bottom:$space--l;
        background-color:$color--bg-main;

    }
</style>
