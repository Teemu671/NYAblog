const BACKEND_URL = "https://cat0s.com:3001"

class User {
  #id = undefined
  #email = undefined
  #token = undefined
  constructor() {
    const userFromStorage = sessionStorage.getItem('user')
    if (userFromStorage) {
      const userObject = JSON.parse(userFromStorage)
      this.#id = userObject.id
      this.#email = userObject.email
      this.#token = userObject.token
    }
  }

  get id() {
    return this.#id
  }

  get email() {
    return this.#email
  }

  get token() {
    return this.#token
  }

  get isLoggedIn() {
    return this.#id !== undefined ? true : false
  }

  async login(email,password) {
    const response = await fetch('https://cat0s.com:3001/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    if (response.ok === true) {
      const json = await response.json()
      this.#id = json.id
      this.#email = json.email
      this.#token = json.token
      sessionStorage.setItem('user',JSON.stringify(json))
      return this
    } else {
      throw response.statusText
    }
  }

  async register(username, email, password) {
  const response = await fetch('https://cat0s.com:3001/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    if (response.ok === true) {
      const json = await response.json()
      return json.id
    } else {
      throw response.statusText
    }
  }
  // async changeDisplayName(username) {
  // const response = await fetch('https://cat0s.com:3001/user/rename', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ username })
  //   });
  //   if (response.ok === true) {
  //     const json = await response.json()
  //     return json.id
  //   } else {
  //     throw response.statusText
  //   }
  // }

  logout() {
    this.#id = undefined
    this.#email = undefined
    this.#token = undefined
    sessionStorage.removeItem('user')
  }

}

export { User }