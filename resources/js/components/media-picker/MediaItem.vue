<template>
    <div
        class="item"
        :class="{ active }"
    >
        <img
            v-if="imgUrl"
            :src="imgUrl"
            :class="{ logo: realType == 'voice' || realType == 'video' }"
        />
        <span
            class="item-title"
            :title="title"
        >{{ title }}</span>
        <a
            target="_blank"
            :href="viewLink(item, realType)"
            class="view"
            @click.stop="onView(item, realType)"
        >
            <loading-dots
                :loading="videoLinkLoading"
                :num="8"
                text="查看"
            />
        </a>
    </div>
</template>

<script>
import viewMedia from '@/common/view-media'

export default {
    name: 'MediaItem',
    mixins: [
        viewMedia,
    ],
    data() {
        return {
            active: false,
        }
    },
    props: {
        item: {
            type: Object,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
    },
    computed: {
        realType() {
            if (this.type != 'news') {
                return this.type
            }

            // news 类型再细分为 news（图文集）和 newsItem （单个图文）类型
            // 通过 content 判断
            if (typeof this.item.content == 'string') {
                return 'newsItem'
            } else {
                return 'news'
            }
        },
        imgUrl() {
            switch (this.realType) {
                // 图文集，则返回图文集中的第一篇文章的封面
                case 'news':
                    return this.item.content.news_item[0].thumb_url
                // 单个图文，直接获取封面
                case 'newsItem':
                    return this.item.thumb_url
                case 'image':
                    return this.item.url
                // 视频和音频，则用图标
                case 'voice':
                case 'video':
                    return require(`@/../img/${this.realType}.png`)
                default:
                    return ''
            }
        },
        title() {
            switch (this.realType) {
                case 'news':
                    return this.item.content.news_item[0].title
                case 'newsItem':
                    return this.item.title
                default:
                    return this.item.name
            }
        },
    },
    mounted() {
        this.$bus.$on('mediaSelected', this.onMediaSelected)
    },
    beforeDestroy() {
        this.$bus.$off('mediaSelected', this.onMediaSelected)
    },
    methods: {
        onMediaSelected(item) {
            this.active = item === this.item
        },
    },
}
</script>

<style scoped lang="scss">
@import "~@/../sass/vars";

.item {
    border: 5px solid $grey;
    margin-left: 15px;
    margin-bottom: 15px;
    font-size: 0px !important;
    cursor: pointer;
    height: 110px;
    width: 110px;
    position: relative;

    &.active {
        border-color: $main-color;
    }

    img {
        height: 100%;
        width: 100%;

        &.logo {
            position: absolute;
            height: 50%;
            width: 50%;
            left: 25px;
            top: 10px;
        }
    }

    .item-title,
    .view {
        position: absolute;
        overflow: hidden;
        display: inline-block;
        background: rgba(231, 231, 235, 0.66);
    }

    .item-title {
        height: 20px;
        left: 0px;
        bottom: 0px;
        right: 0px;
    }

    .view {
        right: 0px;
        top: 0px;
        padding: 0 3px;
        display: none;
        color: #000 !important;
    }

    &:hover {
        .view {
            display: initial;
        }
    }
}
</style>
