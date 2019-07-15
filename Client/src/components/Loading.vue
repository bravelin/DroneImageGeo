<template>
    <div class="ring-loading-wrap">
        <div class="ring-loading">
            <div class="ring-loading-light"></div>
            <div class="ring-loading-track"></div>
        </div>
    </div>
</template>
<style lang="scss">
    .ring-loading-wrap{
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 10;
        background: rgba(0,0,0,0.5);
    }
    .ring-loading{
        position: absolute;
        width: 160px;
        height: 160px;
        top: 50%;
        left: 50%;
        margin: -80px 0 0 -80px;
    }
    @keyframes rotate-360{
        0%{
            transform: rotate(0);
        }
        100%{
            transform: rotate(360deg);
        }
    }
    .ring-loading-light{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        box-shadow: 0 4px 0 rgba(52, 121, 223, 0.9) inset;
        animation: rotate-360 2.5s linear infinite;
    }
    .ring-loading-track{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        box-shadow: 0 0 10px 4px rgba(0,0,0,0.3) inset;
    }
</style>