<template>
  <sui-modal v-model="value" :animationDuration="300" size="tiny" :closable="false">
    <sui-modal-header style="user-select: none" v-if="title">{{ title }}</sui-modal-header>
    <sui-modal-content>
      <sui-modal-description>
        <slot></slot>
      </sui-modal-description>
    </sui-modal-content>
    <sui-modal-actions v-if="!hideActions" class="modal-buttons">
      <sui-button v-if="defaultButton" positive @click.native="hide">OK</sui-button>
      <slot name="buttons"></slot>
    </sui-modal-actions>

    <transition name="fade">
      <div class="ui active inverted dimmer dialogBoxCon" v-if="loading">
        <div class="ui loader"></div>
      </div>
    </transition>

    <transition name="fade">
      <div class="ui active inverted dimmer dialogBoxCon" v-if="dialog.open">
        <div class="content">
          <sui-segment class="dialogBox">
            <div class="text">{{ dialog.text }}</div>
            <sui-button @click="buttonClick('OK')">
              <span v-if="dialog.type == 3">YES</span>
              <span v-else>OK</span>
            </sui-button>
            <sui-button @click="buttonClick('CANCEL')" v-if="dialog.type > 1">
              <span v-if="dialog.type == 3">NO</span>
              <span v-else>CANCEL</span>
            </sui-button>
          </sui-segment>
        </div>
      </div>
    </transition>

  </sui-modal>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";

@Component
export default class Modal extends Vue {
  @Prop({ default: false }) value!: boolean;
  @Prop({ default: "" }) title!: string;
  @Prop({ default: false }) defaultButton!: boolean;
  @Prop({ default: false }) hideActions!: boolean;
  @Prop({ default: false }) loading!: boolean;
  @Prop({
    default: () => ({
      open: false,
      type: 1,
      text: ""
    })
  })
  dialog!: any;

  buttonClick(answer: string) {
    this.dialog.open = false;
    this.$emit("dialogAnswer", answer);
    if (this.dialog.answer) {
      this.dialog.answer(answer);
    }
  }

  hide() {
    this.$emit("input", false);
  }
}
</script>

<style lang="scss">
.modal-buttons > button {
  font-size: 1.2rem !important;
}
.dialogBoxCon > div.content {
  width: 80%;
  height: 160px !important;
  div.center {
    height: 100%;
  }
}
div.dialogBox {
  width: 100%;
  height: 100%;
  box-shadow: 1px 1px 20px #ccc !important;
  color: #222 !important;
  line-height: 1.4;
  div.text {
    height: 94px;
    box-sizing: border-box;
    padding-top: 4px;
    text-align: left;
    font-size: 1.2rem;
  }
  button {
    float: right;
  }
}

// Transition
$duration: 0.2s;
.fade-enter-active, .fade-leave-active {
  transition: opacity $duration !important;

  div.content > div.dialogBox{
    transition: margin $duration !important;
  }

}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0 !important;
  div.content > div.dialogBox{
    margin-top: -2rem;
  }
}
</style>
