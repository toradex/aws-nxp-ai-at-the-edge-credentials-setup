<template>

  <q-page class="flex flex-center">
    <!--<img alt="Quasar logo" src="~assets/quasar-logo-full.svg">-->

    <div class="row q-pa-md q-gutter-md">

      <div class="q-gutter-sm row "><div>

        <q-field label="Bundle File Upload">
        </q-field>

        <q-uploader
          field-name="tar"
          with-credentials=true
          auto-upload
          url="/bundle-tar"
          label="Upload <hash>.tar.gz  Bundle File"
        ></q-uploader>

      </div></div>
      <div class="q-gutter-sm row"><div>

        <q-field label="Single Files Upload">
        </q-field>

        <q-uploader
          field-name="confjson"
          with-credentials=true
          auto-upload
          url="/conf-json"
          label="Upload config.json File"
        ></q-uploader>

        <q-uploader
          field-name="pem"
          with-credentials=true
          auto-upload
          url="/cert-pem"
          label="Upload <hash>.cert.pem File"
        ></q-uploader>

        <q-uploader
          field-name="privkey"
          with-credentials=true
          auto-upload
          url="/cert-priv-key"
          label="Upload <hash>.private.key File"
        ></q-uploader>

      </div></div>

      <div class="q-gutter-sm row"><div>

        <q-field label="Tool Options">
        </q-field>

        <form @submit.prevent="disableForever" class="q-pa-md">
            <q-btn type="submit" :loading="disabling" icon="tv_off" color="primary" label="Disable this UI Forever" class="full-width" >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>

        </form>
      </div></div>

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
  QTooltip
} from 'quasar'

export default {
  name: 'PageIndex',
  components: {
    QInput,
    QToggle,
    QIcon,
    QField,
    QTooltip
  },
  data () {
    return {
      disabling: false
    }
  },
  methods: {
    disableForever () {
      this.disabling = true

      this.$axios.post('/disable', {
        withCredentials: true,
        disable: true
      })
      .then(function (res) {
        console.log(res);
      })
      .catch(function (err) {
        console.log("Error on POST to /disable" + err);
      });

      setTimeout(() => {
        this.disabling = false
      }, 3000)
    }
  }

}
</script>
