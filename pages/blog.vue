<script setup>
const nuxtApp = useNuxtApp()

let categories = ref([])
categories.value = (await nuxtApp.$api.get('categories')).data
categories.value = categories.value.filter(category => category.count > 0)
</script>

<template>
    <div>
        <NuxtLayout name="blog">
            <div>
                <div class="categories-list">
                    <header class="categories-container shortened">
                        <nuxt-link class="category-link" to="/blog" exact-active-class="active">All</nuxt-link>
                        <nuxt-link class="category-link" :to="`/blog/category/${category.slug}`" active-class="active" v-for="category in categories" :key="category.id">{{ category.name }}</nuxt-link>
                    </header>
                </div>
                <NuxtPage />
            </div>
        </NuxtLayout>
    </div>
</template>

<style>

</style>