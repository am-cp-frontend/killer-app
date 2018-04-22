<template>
    <div class = 'header'>
        <div>{{content}}</div>
    </div>

</template>

<script>
export default {
    props: ['content']

}
</script>

<style lang="scss" scoped>
    @import '~@/utils/var.scss';

    .header {
        display:flex;
        background-color: inherit;
        color: $font-color--main;
        font-weight: $font-weight--thin;
        font-family: $font-family--header;
        font-size: $font-size--header;
        justify-content: center;
    }
</style>
