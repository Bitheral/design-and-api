<script setup>
const route = useRoute()
const nuxtApp = useNuxtApp()
let category = ref(null)
let posts = ref(null)

const { slug } = route.params

category.value = (await nuxtApp.$api.get(`categories?slug=${slug}`)).data[0]
posts.value = (await nuxtApp.$api.get(`posts?categories=${category.value.id}&per_page=21`)).data

posts.value.forEach(async (post) => {
    post._author = (await nuxtApp.$api.get(`users/${post.author}`)).data
    if(post.featured_media)
        post._featuredmedia = (await nuxtApp.$api.get(`media/${post.featured_media}`)).data
})

category.value._posts = posts;


function decodeHTMLEntities (string) {
    // In string, find &...; and replace with the decoded value
    return string.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
}
</script>

<template>
    <div class="category solo">
        <h1>{{ category.name }}</h1>
        <div class="posts">
            <NuxtLink v-for="post in category._posts" :key="post.id" :to="`/blog/post/${post.slug}`">
                <div class="card">
                    <img
                        v-if="post._featuredmedia"
                        :srcset="`${post._featuredmedia.media_details.sizes.full?.source_url         } ${post._featuredmedia.media_details.sizes.full?.width         }w,
                ${post._featuredmedia.media_details.sizes.large?.source_url        } ${post._featuredmedia.media_details.sizes.large?.width        }w,
                ${post._featuredmedia.media_details.sizes.medium_large?.source_url } ${post._featuredmedia.media_details.sizes.medium_large?.width }w,
                ${post._featuredmedia.media_details.sizes.medium?.source_url       } ${post._featuredmedia.media_details.sizes.medium?.width       }w,
                ${post._featuredmedia.media_details.sizes.thumbnail?.source_url    } ${post._featuredmedia.media_details.sizes.thumbnail?.width    }w`"
                        :sizes="`100vw`"
                    />
                    <h4 class="title" v-html="post.title.rendered"></h4>
                    <p class="subtitle">
                        <span class="bi-clock date">{{ new Date(post.date_gmt).toLocaleDateString() }}</span>
                        <span class="bi-person author">{{ post._author?.name }}</span>
                    </p>
                    <div class="blurb">{{ decodeHTMLEntities(post.content.rendered.replace(/<\/?[^>]+(>|$)/g, "")) }}</div>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>

<style>

</style>