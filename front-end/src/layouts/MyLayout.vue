<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          Pasta Demo Credentials Configuration - Toradex Apalis iMX8 / Amazon AWS / NXP i.MX 8QuadMax
        </q-toolbar-title>

        <div>
          {{ model }}
        </div>
      </q-toolbar>
    </q-header>


    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      model: ""
    }
  },
  created() {
    this.$axios
      .get('/model', {})
      .then(response => (this.model = response.data))
  }
}
</script>

<style>
</style>
