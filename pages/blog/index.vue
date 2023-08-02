<script setup>
const nuxtApp = useNuxtApp()

let categories = ref([])

categories.value = (await nuxtApp.$api.get('categories')).data
// let categories = (await nuxtApp.$api.get('categories')).data
categories.value = categories.value.filter(category => category.count > 0)
categories.value.forEach(async (category) => {
    category["_posts"] = (await nuxtApp.$api.get('posts?categories=' + category.id)).data.slice(0, 3)
    category["_posts"].forEach(async (post) => {
        post._author = (await nuxtApp.$api.get('users/' + post.author)).data
        if(post._links["wp:featuredmedia"]) {
            post._featuredmedia = (await nuxtApp.$api.get('media/' + post.featured_media)).data
        }
    })
})

function decodeHTMLEntities (string) {
    // In string, find &...; and replace with the decoded value
    return string.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
}

</script>

<template>
    <div>
        <div class="category" v-for="category in categories" :key="category.id">
            <span class="heading">
                <h1 class="title">{{ category.name }}</h1>
                <a class="link" :href="`/blog/category/${category.slug}`">View all posts</a>
            </span>
            <div class="blog container">
                <NuxtLink v-for="post in category._posts" :key="post.id" :to="`/blog/post/${post.slug}`">
                    <div class="blog card">
                        <img
                            class="featured-image"
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
    </div>
</template>

<style>

</style>