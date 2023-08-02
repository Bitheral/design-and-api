<script setup>
    const route = useRoute()
    const nuxtApp = useNuxtApp()
    let post = ref(null)

    const { slug } = route.params
    post.value = (await nuxtApp.$api.get(`posts?slug=${slug}`)).data[0]
    post.value._category = (await nuxtApp.$api.get(`categories?include=${post.value.categories[0]}`)).data[0]
    if(post.value.featured_media)
        post.value._featuredmedia = (await nuxtApp.$api.get(`media/${post.value.featured_media}`)).data
        
    post.value._author = (await nuxtApp.$api.get(`users/${post.value.author}`)).data

    function decodeHTMLEntities (string) {
        // In string, find &...; and replace with the decoded value
        return string.replace(/&#(\d+);/g, function(match, dec) {
            return String.fromCharCode(dec);
        });
    }
</script>

<template>
    <div class="blog post">
        <NuxtLink :to="`/blog/category/${post._category.slug}`"><p id="category">{{ post._category.name }}</p></NuxtLink>
        <h1 title="title">{{ decodeHTMLEntities(post.title.rendered) }}</h1>
        <p class="subtitle">
            <span class="bi-clock date">{{ new Date(post.date).toLocaleDateString() }}</span>
            <span class="bi-person author"> {{ post._author.name }}</span>
        </p>
        <img v-if="post._featuredmedia"
            class="featured-image"
            :srcset="`${post._featuredmedia.media_details.sizes.full?.source_url         } ${post._featuredmedia.media_details.sizes.full?.width         }w,
                ${post._featuredmedia.media_details.sizes.large?.source_url        } ${post._featuredmedia.media_details.sizes.large?.width        }w,
                ${post._featuredmedia.media_details.sizes.medium_large?.source_url } ${post._featuredmedia.media_details.sizes.medium_large?.width }w,
                ${post._featuredmedia.media_details.sizes.medium?.source_url       } ${post._featuredmedia.media_details.sizes.medium?.width       }w,
                ${post._featuredmedia.media_details.sizes.thumbnail?.source_url    } ${post._featuredmedia.media_details.sizes.thumbnail?.width    }w`"
            :sizes="`100vw`"
        />
        <div id="body">
            <div v-html="post.content.rendered"></div>
        </div>
    </div>
</template>