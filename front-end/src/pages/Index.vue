<template>

  <q-page class="flex flex-center">
    <!--<img alt="Quasar logo" src="~assets/quasar-logo-full.svg">-->

    <div class="row q-pa-md q-gutter-md">

      <div class="row "><div>

        <form @submit.prevent="saveConfigData" class="q-pa-md">

          <q-field label="Thing ARN">
            <q-input v-model="thingArn" placeholder="[THING_ARN_HERE]"/>
          </q-field>

          <q-field label="iot Host">
            <q-input v-model="iotHost" placeholder="[HOST_PREFIX_HERE]"/>
          </q-field>

          <q-field label="AWS Region">
            <q-input v-model="awsRegion" placeholder="[AWS_REGION_HERE]"/>
          </q-field>

          <q-field label="Confirmation Password">
            <q-input v-model="password" type="password" inverted placeholder="Password here"/>
          </q-field>

          <q-btn type="submit" :loading="submitting" icon="sync" color="primary" label="Update" class="full-width" >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>

        </form>

      </div></div>
      <div class=" row "><div>

        <q-field label="PEM Certificate Files Upload">
        </q-field>

        <q-uploader
          field-name="pem"
          with-credentials=true
          auto-upload
          url="http://localhost:8000/cert-pem"
          label="Upload <hash>.cert.pem File"
        />

        <q-uploader
          field-name="privkey"
          with-credentials=true
          auto-upload
          url="http://localhost:8000/cert-priv-key"
          label="Upload <hash>.private.key File"
        />

      </div></div>

      <form @submit.prevent="disableForever" class="q-pa-md">

        <div class=" row "><div>
          <q-btn type="submit" :loading="disabling" icon="tv_off" color="primary" label="Disable this UI Forever" class="full-width" >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </div></div>

      </form>

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
      thingArn: '',
      iotHost: '',
      awsRegion: '',
      password: '',
      submitting: false,
      disabling: false
    }
  },
  methods: {
    saveConfigData () {
      this.submitting = true

      this.$axios.post('http://localhost:8000/save', {
        withCredentials: true,
        thingArn: this.thingArn,
        iotHost: this.iotHost,
        awsRegion: this.awsRegion,
        password: this.$sha256(this.password),
      })
      .then(function (res) {
        console.log(res);
      })
      .catch(function (err) {
        console.log("Error on POST to /save" + err);
      });

      setTimeout(() => {
        this.submitting = false
      }, 3000)
    },
    disableForever () {
      this.disabling = true

      this.$axios.post('http://localhost:8000/disable', {
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
