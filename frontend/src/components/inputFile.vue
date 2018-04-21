<template>
    <div class='root'>
        <div class='label'>
            <slot name='label'>
            </slot>
        </div>
        <div class='block'>
            <div class='file-upload'>
                <label>
                    <input id='file' type='file' @change='onChange' accept='image/jpeg,image/png'>
                    <span class='img'><img src='../pictures/upload.png' width='34px' height='34px' ></span>
                    <span class='chooseFile'>{{inpMessage}}</span>
                </label>
            </div>
            <div class='shadow'></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'inputFile',
    data () {
        return {
            inpMessage:'Файл не выбран'
        }
    },
    props: ['value'],
    methods: {
        onChange() {
            var imagefile = document.getElementById('file')
            var val=imagefile.files[0]
            this.inpMessage=val.name
            this.$emit('change', val)
        }
    }
}
</script>
<style lang="scss" scoped  >
    @import '../utils/var';

    .label {
        color:$font-color--accent;
    }
    input[type="file"]{
        display: none;
    }
    .file-upload {
        position: absolute;
        overflow: hidden;
        top:4px;
        left:4px;
        text-align: center;
        width:315px;
        height:50px;
        color:$font-color--light;
        background-color:$color--bg-accent;
        opacity:0.7;
        border:0px;
        z-index:3
    }
    .img {
        position:absolute;
        left:60px;
        top:6px;
    }
    .chooseFile {
        position: absolute;
        top:14px;
        left:110px;
    }
    .file-upload label {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }
    .shadow {

        z-index:2;
        width:315px;
        height:50px;
        background-color:$color--bg-accent;
        opacity:0.7;
        border:0px;

    }
    .root {
        text-align: center;
        margin-top: $space--s;
        width: 100%;
    }
    .block {
        position: relative;
        margin:auto;
        width:320px;
        height:55px;
        left: 50%;
        margin-left:-158px;
    }
    @media screen and (max-width: 320px)  {
        .file-upload {
            width:270px;
        }
        .shadow {
            width:270px;
        }
        .block {
            position: relative;
            width:270px;
            height:56px;
            left: 50%;
            margin-left:-135px;
        }
     }

</style>
