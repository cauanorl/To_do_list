/*

O this funciona como o self em Python porem com comportamentos estranhos
se estiver com problemas, use um console.log(this) para saber ao que ele
está se referenciando

*/

// Criando uma variavel com o this
// ela virá elemento da instancia Main e todos podem acessa-la

const Main = {

   tasks: [],

   init: function() {
      this.casheSelectors()
      this.bindEvents()
      this.getStorage()
      this.buildTasks()
   },

   casheSelectors: function() {
      this.$list = document.querySelector('#list')
      this.$checkButtons = document.querySelectorAll('.check')
      this.$inputTask = document.querySelector('#inputTask')
      this.$removeButtons = document.querySelectorAll('.remove')
   },

   bindEvents: function() {
      const self = this

      this.$checkButtons.forEach(function(button) {
         button.addEventListener('click', self.Events.checkButton_click.bind(self))
      })

      // bind envia o this que ira ser utilizado na função
      this.$inputTask.addEventListener('keypress', self.Events.inputTask_keypress.bind(this))

      this.$removeButtons.forEach(function(button) {
         button.addEventListener('click', self.Events.removeButton_click.bind(self))
      })

   },

   getStorage: function() {
      const tasks = JSON.parse(localStorage.getItem('tasks'))

      if (tasks) {
         this.tasks = tasks
      }
   },

   buildTasks: function() {
      if (this.tasks) {
         for (let task of this.tasks) {
            this.$list.innerHTML += this.functionsAnonym.insertLi(task.task, task.done)
         }

         this.casheSelectors()
         this.bindEvents()
      }

   },

   Events: {
      checkButton_click: function(event) {
         const $li = event.target.parentElement
         const isDone = $li.classList.contains('done')
         const valueLi = $li.dataset['task']

         if (!isDone) {
            for (let item of this.tasks) {
               if (item.task === valueLi) {
                  item.done = true
               }
            }
            localStorage.setItem('tasks', JSON.stringify(this.tasks))
            return $li.classList.add('done')
         }
         for (const item of this.tasks) {
            if (item.task === valueLi) {
               item.done = false
            }
         }

         localStorage.setItem('tasks', JSON.stringify(this.tasks))
         $li.classList.remove('done')
      },

      inputTask_keypress: function(event) {
         const key = event.key
         const inputValue = event.target.value

         if (key === 'Enter' && inputValue !== '') {
               
               this.$list.innerHTML += this.functionsAnonym.insertLi(inputValue, false)
               event.target.value = ''

               this.casheSelectors()
               this.bindEvents()

               const savedTasks = localStorage.getItem('tasks')
               const savedTasksObj = JSON.parse(savedTasks)
               let obj

               if (savedTasks) {
                  obj = [
                     {task: inputValue, done: false},
                     ...savedTasksObj,  // ... serve para mostrar ao javascript que o resto dos objetos serão salvos ali
                  ]
               }
               else {
                  obj = [{task: inputValue, done: false}]
               }

               this.tasks = obj
               localStorage.setItem('tasks', JSON.stringify(obj))
         
         }

      },
      
      removeButton_click: function(event) {
         const $li = event.target.parentElement
         const value = event.target.dataset['task']

         const newTasksState = this.tasks.filter(task => task.task !== value)
         this.tasks = newTasksState


         localStorage.setItem('tasks', JSON.stringify(newTasksState))

         $li.classList.add('removed')

         setTimeout(function() {
               $li.classList.add('hidden')
         }, 300)

      },
   },

   functionsAnonym: {
      insertLi: (value, done) => {
         let check = ''

         if (done) {
            check = 'done'
         }

         return `
         <li class='${check}' data-task="${value}">
            <div class='check'></div>
               <label class='task'>
               ${value}
               </label>
            <button class='remove' data-task="${value}"></button>
         </li>
      `
      },
   },
}

Main.init()
