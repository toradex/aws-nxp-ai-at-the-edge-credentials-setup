<template>
  <q-page class="flex flex-center column">
    <!--<img alt="Quasar logo" src="~assets/quasar-logo-full.svg">-->

    <div class="row q-pa-md q-gutter-md" style="width: 100%">
      <div class="q-gutter-sm row">
        <div>
          <q-field label="Option A - Enter AWS Credentials"></q-field>

          <q-card class="my-card">
            <q-card-section>
              <q-input v-model="ggName" label="IoT Core Group Name" />

              <q-input v-model="keyid" label="Access key ID" />

              <q-input style="margin-bottom: 20px" v-model="key" label="Secret access key" />

              <q-btn
                @click="runBigBang()"
                type="button"
                icon="cloud_done"
                color="primary"
                label="Run CloudFormation"
                class="full-width"
              >
                <template v-slot:loading>
                  <q-spinner-facebook />
                </template>
              </q-btn>

              <q-linear-progress
                stripe
                rounded
                style="height: 26px"
                class="q-mt-lg"
                :value="progress"
              >
                <div class="absolute-full flex flex-center">
                  <q-badge color="white" text-color="blue" :label="progressLabel"></q-badge>
                </div>
              </q-linear-progress>

              <p v-show="weburls">
                Your web dashboard is available at:
                <br />
                {{weburls}}
              </p>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="q-gutter-sm row">
        <div>
          <q-field label="Option B - Bundle File Upload"></q-field>

          <q-card class="my-card">
            <q-card-section>
              <q-uploader
                style="margin-bottom: 10px"
                field-name="tar"
                with-credentials="true"
                auto-upload
                url="/bundle-tar"
                label="Upload <hash>.tar.gz  Bundle File"
              ></q-uploader>

              <form @submit.prevent="updtCredentials" class="q-pa-md">
                <q-btn
                  type="submit"
                  :loading="updting"
                  icon="update"
                  color="primary"
                  label="Apply credentials"
                  class="full-width"
                >
                  <template v-slot:loading>
                    <q-spinner-facebook />
                  </template>
                </q-btn>
              </form>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="q-gutter-sm row">
        <div>
          <q-field label="Option C - Single Files Upload"></q-field>

          <q-card class="my-card">
            <q-card-section>
              <q-uploader
                style="margin-bottom: 10px"
                field-name="confjson"
                with-credentials="true"
                auto-upload
                url="/conf-json"
                label="Upload config.json File"
              ></q-uploader>

              <q-uploader
                style="margin-bottom: 10px"
                field-name="pem"
                with-credentials="true"
                auto-upload
                url="/cert-pem"
                label="Upload <hash>.cert.pem File"
              ></q-uploader>

              <q-uploader
                field-name="privkey"
                with-credentials="true"
                auto-upload
                url="/cert-priv-key"
                label="Upload <hash>.private.key File"
              ></q-uploader>

              <form @submit.prevent="updtCredentials" class="q-pa-md">
                <q-btn
                  type="submit"
                  :loading="updting"
                  icon="update"
                  color="primary"
                  label="Apply credentials"
                  class="full-width"
                >
                  <template v-slot:loading>
                    <q-spinner-facebook />
                  </template>
                </q-btn>
              </form>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="q-gutter-sm row">
        <div>
          <q-field label="Tool Options"></q-field>

          <form @submit.prevent="disableForever" class="q-pa-md">
            <q-btn
              type="submit"
              :loading="disabling"
              icon="tv_off"
              color="primary"
              label="Disable this UI forever"
              class="full-width"
            >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </form>
        </div>
      </div>

      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">{{loadText}}</div>
          </q-card-section>

          <q-card-section :style="dispSpinner" style="text-align: center;">
            <q-spinner color="primary" size="3em" :thickness="10" />
          </q-card-section>

          <q-card-section
            :style="dispError"
            style="text-align: center; color: red; font-size: 120px;"
          >
            <q-icon name="error_outline" />
          </q-card-section>

          <q-card-section
            :style="dispSuccess"
            style="text-align: center; color: green; font-size: 120px;"
          >
            <q-icon name="insert_emoticon" />
          </q-card-section>

          <q-card-section style="text-align: center;">
            <div class="text-h10">{{descText}}</div>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Ok" :disabled="canDisabled" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <div class="row q-pa-md q-gutter-md" style="width: 100%;">
      <div class="q-gutter-sm row" style="width: 100%;">
        <div style="width: 47%;">
          <q-field
            label="Building Log">
            <template v-slot:append>
              <q-icon name="file_copy" @click="clipboard(bigbanglog)" class="cursor-pointer" />
            </template>
          </q-field>
          <q-scroll-area ref="bblogposition" :visible="true" style="height: 200px;">
            <span style="white-space: pre;">{{bigbanglog}}</span>
          </q-scroll-area>
        </div>
        <div style="width: 47%;">
          <q-field label="Status Log">
            <template v-slot:append>
              <q-icon name="file_copy" @click="clipboard(bigbangerr)" class="cursor-pointer" />
            </template>
          </q-field>
          <q-scroll-area ref="bberrposition" :visible="true" style="height: 200px;">
            <span style="white-space: pre;">{{bigbangerr}}</span>
          </q-scroll-area>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import {
  QInput,
  QToggle,
  QIcon,
  QField,
  QTooltip,
  QLinearProgress,
  QBadge
} from "quasar";

export default {
  name: "PageIndex",
  components: {
    QInput,
    QToggle,
    QIcon,
    QField,
    QTooltip,
    QLinearProgress,
    QBadge
  },
  data() {
    return {
      loadText: "Loading",
      descText: "Cloud Formation Success",
      dispSpinner: "display: block",
      dispError: "display: none",
      dispSuccess: "display: none",
      ggName: "pasta_demo_cfn",
      disabling: false,
      updting: false,
      prompt: false,
      canDisabled: true,
      address: "",
      keyid: "",
      key: "",
      progress: 0.0,
      weburls: "",
      bigbanglog: "",
      bigbangerr: ""
    };
  },
  computed: {
    progressLabel() {
      return (this.progress * 100).toFixed(2) + "%";
    }
  },
  methods: {
    updtProgressBar() {
      var me = this;
      setInterval(() => {
        this.$axios
          .post("/progress", {
            updatecredentials: true
          })
          .then(function(res) {
            if (res.status == 200) {
              me.progress = Number(res.data) / 100;
            }
          })
          .catch(function(err) {
            console.log("Error on POST to /progress" + err);
          });
      }, 5000);
    },
    getWebURL() {
      var me = this;
      setInterval(() => {
        this.$axios
          .post("/webdashboards", {
            updatecredentials: true
          })
          .then(function(res) {
            if (res.status == 200) {
              me.weburls = res.data;
            }
          })
          .catch(function(err) {
            console.log("Error on POST to /webdashboards" + err);
          });
      }, 30000);
    },
    getBigbangLog() {
      var me = this;
      setInterval(() => {
        this.$axios
          .post("/progresslog", {
            updatecredentials: true
          })
          .then(function(res) {
            if (res.status == 200) {
              me.bigbanglog += res.data.log.toString();
              me.bigbangerr += res.data.err.toString();
              me.$refs.bblogposition.setScrollPosition(99999999, 1500);
              me.$refs.bberrposition.setScrollPosition(99999999, 1500);
            }
          })
          .catch(function(err) {
            console.log("Error on POST to /progresslog" + err);
          });
      }, 5000);
    },
    disableForever() {
      this.disabling = true;

      this.$axios
        .post("/disable", {
          withCredentials: true,
          disable: true
        })
        .then(function(res) {
          console.log(res);
        })
        .catch(function(err) {
          console.log("Error on POST to /disable" + err);
        });

      setTimeout(() => {
        this.disabling = false;
      }, 3000);
    },
    updtCredentials() {
      this.updting = true;

      this.$axios
        .post("/updatecredentials", {
          updatecredentials: true
        })
        .then(function(res) {
          console.log(res);
        })
        .catch(function(err) {
          console.log("Error on POST to /updatecredentials" + err);
        });

      setTimeout(() => {
        this.updting = false;
      }, 3000);
    },
    runBigBang() {
      this.prompt = true;
      var me = this;
      me.canDisabled = true;
      me.dispSuccess = "display: none;";
      me.dispError = "display: none;";
      me.dispSpinner = "display: block;";
      me.descText = "";
      me.loadText = "Running ...";

      console.info(me.key);
      console.info(me.keyid);

      if (me.keyid != "" && me.key != "") {
        this.$axios
          .post("/bigbang", {
            keyId: me.keyid,
            key: me.key,
            ggName: me.ggName
          })
          .then(res => {
            console.log("big bang call");
            console.info(res);

            if (res.status == 200) {
              me.canDisabled = false;
              me.dispSuccess = "display: block;";
              me.dispError = "display: none;";
              me.dispSpinner = "display: none;";
              me.descText = "";
              me.loadText =
                "Deployment is running. It takes time, around 1 hour.";
            } else {
              me.canDisabled = false;
              me.dispSuccess = "display: none;";
              me.dispError = "display: block;";
              me.dispSpinner = "display: none;";
              me.descText = "Error trying to run AWS CloudFormation";
              me.loadText = "Error";
            }
          })
          .catch(function(err) {
            console.log("Error on POST to /bigbang " + err);
            me.dispSpinner = "display: none;";
            me.dispSuccess = "display: none;";
            me.loadText = "Error";
            me.descText = "Error trying to connect to endpoint";
            me.dispError = "display: block;";
            me.canDisabled = false;
          });
      } else {
        me.dispSpinner = "display: none;";
        me.dispSuccess = "display: none;";
        me.loadText = "Error";
        me.descText = "Empty Fields";
        me.dispError = "display: block;";
        me.canDisabled = false;
      }
    },
    clipboard(text) {
      var textArea = document.createElement("textarea");

      textArea.style.position = 'fixed';
      textArea.style.top = 0;
      textArea.style.left = 0;

      // Ensure it has a small width and height. Setting to 1px / 1em
      // doesn't work as this gives a negative w/h on some browsers.
      textArea.style.width = '2em';
      textArea.style.height = '2em';

      // We don't need padding, reducing the size if it does flash render.
      textArea.style.padding = 0;

      // Clean up any borders.
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';

      // Avoid flash of white box if rendered for any reason.
      textArea.style.background = 'transparent';


      textArea.value = text;

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
      } catch (err) {
        console.log('Oops, unable to copy');
      }

      document.body.removeChild(textArea);
    }
  },
  created() {
    this.updtProgressBar();
    this.getWebURL();
    this.getBigbangLog();
  },
};
</script>
