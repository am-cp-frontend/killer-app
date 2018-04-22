<template>
    <div id='app' >
        <form  enctype="multipart/form-data" method="post" >
            <layout v-show='stage1'>
                <div slot='header'>
                    Регистрация
                </div>
                <div slot='content'>
                    <inputText v-model='email'>
                        <span slot='label'>Email</span>
                        <div slot='error'>
                            <span  v-if='!$v.email.required&&err'>Введите email</span>
                            <span v-if='!$v.email.email'>Не email</span>
                        </div>
                    </inputText>

                    <br>

                    <inputText v-model='deathCode'>
                        <span slot='label'>Код смерти</span>
                        <div slot='error'>
                            <span v-if='!$v.deathCode.required&&err'>Введите код</span>
                            <span v-if='!$v.deathCode.between'>Число от 1000 до 9999</span>
                        </div>
                    </inputText>

                    <br>

                    <inputText v-model='deathCodeRep'>
                        <span slot='label'>Повторите код</span>
                        <div slot='error'>
                            <span v-if='!$v.deathCodeRep.required&&err'>Повторите код</span>
                            <span v-if='!$v.deathCodeRep.sameAsCode&&$v.deathCodeRep.required'>Коды не совпадают</span>

                        </div>
                    </inputText>
                </div>

                <div slot='footer'>
                    <img src='../pictures/arrow.png' width='37px' height='47px' @click='nextStage'>
                </div>
            </layout>

            <layout v-show='!stage1' >
                <div slot='header'>Досье</div>
                <div slot='content'>
                    <inputText v-model='name.first'>
                        <span slot='label'>Имя</span>
                        <div slot='error'>
                            <span v-if='!$v.name.first.required&&err'>Введите имя</span>
                            <span v-if='!$v.name.first.alpha'>Только буквы</span></div>
                    </inputText>

                    <br>

                    <inputText v-model='name.last'>
                        <span slot='label'>Фамилия</span>
                        <div slot='error'>
                            <span v-if='!$v.name.last.required&&err'>Введите фамилию</span>
                            <span v-if='!$v.name.last.alpha'>Только буквы</span>
                        </div>
                    </inputText>

                    <br>

                    <inputText v-model='courseStr' @input='checkCourse'>
                        <span slot='label'>Курс</span>
                        <div slot='error'>
                            <span v-if='!$v.courseStr.required&&err'>Введите курс</span>
                            <span v-if='(errCourse)&&($v.courseStr.required)'>Некоррекные данные</span>
                        </div>
                    </inputText>

                    <br>

                    <inputText v-model='vk'>
                        <span slot='label'>Vk</span>
                        <div slot='error'>
                             <span v-if='!$v.vk.required&&err'>Введите vk</span>
                         </div>
                     </inputText>

                     <br>

                     <inputFile @change='loadPhoto'>
                         <span slot='label'>Фото</span>
                         <div slot='error'>
                              <span v-if='!$v.photo.required&&err'>Загрузите фото</span>
                          </div>
                      </inputFile>

                      <br>
                  </div>
                  <div slot='footer'>
                      <div class='arrows'>
                          <div class='left'>
                              <img src='../pictures/arrow2.png' width='37px' height='47px' @click='lastStage'>
                          </div>
                          <div class='right'>
                              <img src='../pictures/arrow.png' width='37px' height='47px' @click='register'>
                          </div>
                      </div>
                  </div>
              </layout>
          </form>
      </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required,alpha,email,between,sameAs } from 'vuelidate/lib/validators'
import inputText from './input.vue'
import inputFile from './inputFile.vue'
import layout from './Layout.vue'
export default {
    data () {
        return {
            name:{
                first:'',
                last:''
            },
            email:'',
            courseStr:'',
            courseValue:'',
            vk:'',
            photo:'',
            deathCode:'',
            deathCodeRep:'',
            errCourse:false,
            stage1:true,
            err:false
        }
    },
    components: {
        'inputText':inputText,
        'inputFile':inputFile,
        'layout':layout
    },

    mixins: [validationMixin],

    validations: {
        name: {
            first:{
                required,
                alpha
            },
            last:{
                required,
                alpha
            }
        },
        vk:{
            required,

        },
        photo:{
            required
        },
        email:{
            required,
            email
        },
        deathCode:{
            required,
            between:between(1000,9999)
        },
        courseStr:{
            required
        },
        deathCodeRep:{
            required,
            sameAsCode:sameAs('deathCode')
        }

    },

    methods: {
        loadPhoto (value) {
            this.photo=value
        },
        nextStage () {
            if(!this.$v.email.$invalid&&!this.$v.deathCode.$invalid&&!this.$v.deathCodeRep.$invalid)
            {
                this.stage1=false
                this.err=false
            }
            else this.err=true

        },
        lastStage () {
            this.stage1=true

        },
        checkCourse () {
            var value
            if(this.courseStr.match(/[0-4]/i)||(this.courseStr.match(/преп/i))||(this.courseStr.match(/асп/i)))
            {
                if(this.courseStr.match(/преп/i)) {
                    this.errCourse=false
                    this.courseValue=8
                    return
                }
                if(this.courseStr.match(/маг/i)) {
                    if(this.courseStr.match(/[0-2]/i)) {
                        this.errCourse=false
                        value=this.courseStr.match(/[0-2]/i)[0]
                        this.courseValue=String(4+Number(value))
                        return
                    }
                    else {
                        this.errCourse=true
                        return
                    }
                }
                if(this.courseStr.match(/асп/i)) {
                    this.errCourse=false
                    this.courseValue=7
                    return
                }
                value=this.courseStr.match(/[0-4]/i)[0]
                this.courseValue=value
                this.errCourse=false
            }
            else {
                this.errCourse=true
            }
        },
        register () {
            if(!this.$v.$invalid&&!this.errCourse){
                var postBody= {
                    name:this.name,
                    course:this.courseValue,
                    email:this.email,
                    vk:this.vk,
                    photo:this.photo,
                    deathCode:this.deathCode
                }
                this.$store.dispatch('register',postBody)
            }
            else this.err=true
        }
    }
}
</script>
<style lang="scss"  >
    @import '../utils/var';
    body {
        background-color:$color--bg-main;
    }
    .arrows {
        position: relative;
        width:320px;
        margin-left:auto;
        margin-right: auto;
    }
    .left {
        position:absolute;
        left:0px;
    }
    .right {
        position:absolute;
        right:0px;
    }
    @media screen and (max-width: 320px) {
        .arrows {
            width:270px;
        }
    }
</style>
