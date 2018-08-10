
export const getUserData = {
  methods: {
    getUserData () {
      let self = this
      self.$ajax({
        method: 'get',
        url: self.$apiMember + 'member/currentMember',
        params: {}
      }).then(function (response) {
        self.$store.commit('userDataChange', response.data.data)
        localStorage.setItem('member_type', response.data.data.member_type)
        if (response.data.data.member_type === '091') {
          if (response.data.data.reg_present === '11') {
            self.$store.commit('setShowRegisterTicket', false)
          } else {
            self.$store.commit('setShowRegisterTicket', true)
          }
        } else {
          self.$store.commit('setShowRegisterTicket', false)
        }
      })
    }
  }
}
